import mediapipe as mp

mp_pose = mp.solutions.pose

class PostureChecker:
    def __init__(self):
        self.calibrated = False
        self.baseline_ratio = 0
        self.deviation_threshold = 0.05

    def _calculate_normalized_v_ratio(self, landmarks):
        shoulder_L = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        shoulder_R = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        nose = landmarks[mp_pose.PoseLandmark.NOSE.value]
            

        shoulder_width = abs(shoulder_L.x - shoulder_R.x)
        mid_point_shoulder = (shoulder_L.y + shoulder_R.y) / 2

        vertical_distance = abs(nose.y - mid_point_shoulder)
            
        normalized_ratio = vertical_distance / shoulder_width
        return normalized_ratio

    def calibrate(self, landmarks):
        """Sets the current posture as the baseline for vertical head position."""
        try:
            
            self.baseline_ratio = self._calculate_normalized_v_ratio(landmarks)
            self.calibrated = True
            print(f"Calibration successful. Baseline ratio: {self.baseline_ratio:.3f}")
            return True
        except:
            return False

    def check_posture(self, landmarks):
        """Checks the current normalized ratio against the calibrated baseline."""
        if not self.calibrated:
            return "PRESS 'C' TO CALIBRATE", 0

        try:
       
            current_ratio = self._calculate_normalized_v_ratio(landmarks)

            deviation = abs(current_ratio - self.baseline_ratio)
        
            if deviation > self.deviation_threshold:
                status = "SLOUCHING"
            else:
                status = "GOOD POSTURE"
            
            return status, current_ratio
        except:
            return "NO PERSON DETECTED", 0