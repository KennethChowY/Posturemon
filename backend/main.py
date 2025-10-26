import threading
import cv2
import sys
import mediapipe as mp
from posture import PostureChecker
from database import DatabaseLogger
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

camera_connected = False
camera_thread = None
stop_event = threading.Event()
calibration_requested = threading.Event()

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

checker = PostureChecker()

# Initialize user
user_id = "test"  # Default test user
user_name = "test_user"

# Shared state for posture data
current_posture_data = {
    "status": "CALIBRATE FIRST",
    "distance": 0.0,
    "calibrated": False,
    "timestamp": time.time()
}

def initialize_user():
    """Initialize user without blocking"""
    global user_id, user_name
    if user_id is None:
        temp_logger = DatabaseLogger()
        if len(sys.argv) > 2:
            user_name = sys.argv[2]
        print(f"Initializing user: {user_name}")
        user_id = temp_logger.get_or_create_user(user_name)
        print(f"User ID: {user_id}")
        temp_logger.close()

def camera_loop():
    """Camera loop - runs WITHOUT cv2.imshow in API mode"""
    global camera_connected, current_posture_data
    
    initialize_user()
    thread_db_logger = DatabaseLogger()
    
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ No camera detected")
        camera_connected = False
        thread_db_logger.close()
        return

    print("✅ Camera opened successfully")
    print("📹 Processing frames... (no window in API mode)")
    print("💡 Click 'Calibrate' button in UI to calibrate posture")
    print("📊 Logging to database every 3 seconds")
    
    frame_count = 0
    last_log_time = time.time()
    LOG_INTERVAL = 3.0  # Log every 3 seconds

    try:
        while not stop_event.is_set():
            success, frame = cap.read()

            if not success:
                continue

            frame_count += 1

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            # Check if calibration was requested
            if calibration_requested.is_set() and results.pose_landmarks:
                checker.calibrate(results.pose_landmarks.landmark)
                calibration_requested.clear()
                print("✅ Calibrated via API button!")
            
            # Get status from the check_posture
            status, distance = checker.check_posture(
                results.pose_landmarks.landmark if results.pose_landmarks else None
            )
            
            # Convert distance to float
            distance_value = float(distance) if distance is not None else 0.0
            
            # Update shared posture data (every frame for real-time UI)
            current_posture_data = {
                "status": status,
                "distance": distance_value,
                "calibrated": checker.calibrated,
                "timestamp": time.time(),
                "frame_count": frame_count
            }
            
            # Log to database every 3 seconds (not every frame!)
            current_time = time.time()
            if checker.calibrated and user_id and (current_time - last_log_time) >= LOG_INTERVAL:
                try:
                    thread_db_logger.log(user_id, distance, status)
                    last_log_time = current_time
                    
                    # Print log confirmation
                    if frame_count % 60 == 0:  # Every 60 frames (~3 seconds)
                        print(f"📝 Logged: {status} | Distance: {distance_value:.2f}")
                except Exception as e:
                    print(f"⚠️ Database log error: {e}")
            
            # Print status every 60 frames
            if frame_count % 60 == 0:
                print(f"Frame {frame_count}: {status} | Distance: {distance_value:.2f} | Calibrated: {checker.calibrated}")

            time.sleep(0.05)
    
    finally:
        cap.release()
        thread_db_logger.close()
        camera_connected = False
        print("✅ Camera stopped and released")

def camera_loop_with_display():
    """Camera loop WITH display - for demo mode only"""
    global camera_connected
    
    initialize_user()
    thread_db_logger = DatabaseLogger()
    
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ No camera detected")
        thread_db_logger.close()
        return

    print("✅ Camera opened with display window")
    print("Press 'c' to calibrate")
    print("Press 'q' to quit")

    try:
        while True:
            success, frame = cap.read()

            if not success:
                continue

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            status, distance = checker.check_posture(
                results.pose_landmarks.landmark if results.pose_landmarks else None
            )
            
            key = cv2.waitKey(50) & 0xFF

            if key == ord('q'):
                print("User pressed 'q' - stopping camera")
                break

            if key == ord('c'):
                if results.pose_landmarks:
                    checker.calibrate(results.pose_landmarks.landmark)
                    print("✅ Calibrated!")

            if checker.calibrated and user_id:
                try:
                    thread_db_logger.log(user_id, distance, status)
                except Exception as e:
                    print(f"⚠️ Database log error: {e}")

            color = (0, 255, 0)
            if "SLOUCHING" in status:
                color = (0, 0, 255)
            elif "CALIBRATE" in status:
                color = (0, 255, 255)

            cv2.putText(frame, f"STATUS: {status}", (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
            
            if checker.calibrated:
                distance_value = float(distance) if distance is not None else 0.0
                cv2.putText(frame, f"V-Distance: {distance_value:.2f}", (50, 100), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            cv2.imshow("Posture Checker", frame)
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
        thread_db_logger.close()
        print("✅ Camera stopped")

# Check if running in demo mode
if len(sys.argv) > 1 and sys.argv[1] == "--demo":
    print("Running in demo mode (with display window)")
    camera_loop_with_display()
else:
    # API mode
    print("🚀 Starting Flask API server...")
    
    @app.route('/api/camera/start', methods=['POST'])
    def start_camera():
        global camera_connected, camera_thread, stop_event
        
        if not camera_connected:
            print("📹 Starting camera...")
            stop_event.clear()
            camera_thread = threading.Thread(target=camera_loop, daemon=True)
            camera_thread.start()
            camera_connected = True
            return jsonify({"status": "camera started"}), 200
        else:
            print("⚠️ Camera already running")
            return jsonify({"status": "camera already running"}), 200

    @app.route('/api/camera/stop', methods=['POST'])
    def stop_camera():
        global camera_connected, stop_event
        
        if camera_connected:
            print("🛑 Stopping camera...")
            stop_event.set()
            time.sleep(0.5)
            camera_connected = False
            return jsonify({"status": "camera stopped"}), 200
        else:
            print("⚠️ Camera not running")
            return jsonify({"status": "camera not running"}), 200

    @app.route('/api/camera/calibrate', methods=['POST'])
    def calibrate_camera():
        """Trigger calibration via API button"""
        global checker, calibration_requested
        
        if camera_connected:
            print("🎯 Calibration requested via button")
            if checker.calibrated:
                print("🔄 Re-calibrating (resetting previous calibration)")
            calibration_requested.set()
            return jsonify({
                "status": "calibration requested",
                "message": "Will calibrate on next frame with detected pose",
                "recalibrating": checker.calibrated
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Camera not running"
            }), 400

    @app.route('/api/posture/current', methods=['GET'])
    def get_current_posture():
        """Get current posture data"""
        return jsonify(current_posture_data), 200

    @app.route('/api/stats/today', methods=['GET'])
    def get_today_stats():
        """Get today's statistics from database"""
        try:
            db = DatabaseLogger()
            
            # Get today's date string
            today = datetime.now()
            today_date_str = today.strftime('%Y-%m-%d')
            
            print(f"📊 Fetching stats for: {today_date_str}")
            print(f"   User ID: {user_id}")
            
            # Query database for ALL of today's readings using date comparison
            query = """
                SELECT posture_score, status, timestamp
                FROM posture_logs
                WHERE user_id = ? 
                AND DATE(datetime(timestamp, 'unixepoch'), 'localtime') = ?
                ORDER BY timestamp ASC
            """
            
            db.cursor.execute(query, (user_id, today_date_str))
            results = db.cursor.fetchall()
            
            db.close()
            
            print(f"📊 Found {len(results)} readings for today")
            
            if results and len(results) > 0:
                # Calculate average score from all readings
                total_score = sum(row[0] for row in results)
                raw_avg = total_score / len(results)
                
                # Check if scores are 0-1 scale and convert to 0-100
                if raw_avg <= 1.0:
                    avg_score = round(raw_avg * 100, 1)
                    print(f"   📊 Converted: {raw_avg:.3f} → {avg_score} (0-1 scale detected)")
                else:
                    avg_score = round(raw_avg, 1)
                    print(f"   📊 Score already in 0-100 scale: {avg_score}")
                
                total_readings = len(results)
                
                # Count good vs bad posture
                good_count = sum(1 for row in results if 'GOOD' in row[1].upper())
                bad_count = sum(1 for row in results if 'SLOUCH' in row[1].upper())
                
                # Calculate time in good posture (3 second intervals now!)
                READING_INTERVAL = 3.0  # 3 seconds per reading
                
                # Calculate consecutive good posture periods
                good_time_seconds = 0
                current_good_streak = 0
                
                for i, row in enumerate(results):
                    status = row[1].upper()
                    
                    if 'GOOD' in status:
                        current_good_streak += 1
                    else:
                        # End of good streak, add time
                        if current_good_streak > 0:
                            good_time_seconds += current_good_streak * READING_INTERVAL
                            current_good_streak = 0
                
                # Don't forget last streak
                if current_good_streak > 0:
                    good_time_seconds += current_good_streak * READING_INTERVAL
                
                # Convert to hours
                good_time_hours = round(good_time_seconds / 3600, 1)
                
                # Calculate percentage
                good_percentage = round((good_count / total_readings * 100)) if total_readings > 0 else 0
                
                print(f"📊 Today's stats: avg={avg_score}, readings={total_readings}, good_hours={good_time_hours}")
                
                return jsonify({
                    "average_score": avg_score,
                    "total_readings": total_readings,
                    "good_posture_count": good_count,
                    "bad_posture_count": bad_count,
                    "good_posture_percentage": good_percentage,
                    "good_posture_hours": good_time_hours,
                    "date": today.isoformat()
                }), 200
            else:
                return jsonify({
                    "average_score": 0,
                    "total_readings": 0,
                    "good_posture_count": 0,
                    "bad_posture_count": 0,
                    "good_posture_percentage": 0,
                    "good_posture_hours": 0,
                    "date": today.isoformat()
                }), 200
                
        except Exception as e:
            print(f"❌ Error getting today's stats: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

    @app.route('/api/stats/week', methods=['GET'])
    def get_week_stats():
        """Get last 7 days statistics"""
        try:
            db = DatabaseLogger()
            
            # Get last 7 days
            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            
            print(f"📊 Fetching weekly stats...")
            print(f"   User ID: {user_id}")
            
            # Query for daily averages using proper date grouping
            # Note: The GROUP BY clause must match the SELECT clause exactly
            query = """
                SELECT 
                    DATE(datetime(timestamp, 'unixepoch'), 'localtime') as date,
                    AVG(posture_score) as avg_score,
                    COUNT(*) as reading_count
                FROM posture_logs
                WHERE user_id = ?
                GROUP BY DATE(datetime(timestamp, 'unixepoch'), 'localtime')
                ORDER BY date DESC
                LIMIT 30
            """
            
            db.cursor.execute(query, (user_id,))
            results = db.cursor.fetchall()
            
            print(f"   Found {len(results)} days with data")
            
            db.close()
            
            # Create a map of date -> score
            score_map = {}
            for row in results:
                date_str = row[0]
                raw_score = row[1] if row[1] else 0
                reading_count = row[2]
                
                if date_str:  # Only add if date is not None
                    # Convert 0-1 scale to 0-100 scale
                    if raw_score > 0 and raw_score <= 1.0:
                        avg_score = round(raw_score * 100, 1)
                        print(f"  {date_str}: {avg_score} (from {reading_count} readings) [converted from {raw_score:.3f}]")
                    else:
                        avg_score = round(raw_score, 1)
                        print(f"  {date_str}: {avg_score} (from {reading_count} readings)")
                    
                    score_map[date_str] = avg_score
                else:
                    print(f"  WARNING: Got None for date with score {raw_score}")
            
            # Generate last 7 days including days with no data
            daily_scores = []
            for i in range(6, -1, -1):  # 6 days ago to today
                day = today - timedelta(days=i)
                date_str = day.strftime('%Y-%m-%d')
                
                score = score_map.get(date_str, 0)
                
                daily_scores.append({
                    "date": date_str,
                    "average_score": score  # 0 if no data
                })
                
                print(f"  Day {6-i} ago ({date_str}): {score}")
            
            return jsonify({
                "daily_scores": daily_scores
            }), 200
            
        except Exception as e:
            print(f"❌ Error getting week stats: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

    @app.route('/api/status', methods=['GET'])
    def get_status():
        return jsonify({
            "cameraConnected": camera_connected,
            "calibrated": checker.calibrated if checker else False,
            "postureData": current_posture_data
        })

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "ok",
            "cameraConnected": camera_connected,
            "calibrated": checker.calibrated if checker else False
        }), 200

    @app.route('/api/user/set', methods=['POST'])
    def set_user():
        """Set the user name and create/get user ID"""
        global user_id, user_name

        data = request.get_json()
        new_user_name = data.get("userName", "").strip()

        if not new_user_name:
            return jsonify({
                "status": "error",
                "message": "User name is required"
            }), 400

        try:
            # Update user name
            user_name = new_user_name

            # Get or create user ID from database
            temp_logger = DatabaseLogger()
            user_id = temp_logger.get_or_create_user(user_name)
            temp_logger.close()

            print(f"✅ User set: {user_name} (ID: {user_id})")

            return jsonify({
                "status": "success",
                "userName": user_name,
                "userId": user_id
            }), 200

        except Exception as e:
            print(f"❌ Error setting user: {e}")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @app.route('/api/user/get', methods=['GET'])
    def get_user():
        """Get current user info"""
        return jsonify({
            "userName": user_name,
            "userId": user_id
        }), 200

    # Print startup info
    print("\n" + "="*50)
    print("✅ Flask server starting...")
    print("📍 API available at: http://localhost:5050")
    print("📍 Frontend connects from: http://localhost:3000")
    print("\n🎥 Camera Mode: HEADLESS (no window)")
    print("   ✓ Manual calibration via button")
    print("   ✓ Check terminal for posture updates")
    print("   ✓ Stats available at /api/stats/today")
    print("\n💡 TIP: Run 'python main.py --demo' to see window")
    print("="*50 + "\n")

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5050, debug=True, use_reloader=False)