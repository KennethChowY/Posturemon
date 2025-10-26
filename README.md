# Posture Checker
A real time posture checker tool. Uses webcam and reminds you to not slouch!

## Why?
In this generation the usage of technology is huge and many will sit hours in front of their computers doing work and playing games. A lot of people get bad posture and neck pain because of this.

This application will solve this problem by giving reminders such as streching and taking breaks.

## How it works
Uses OpenCV to capture live video feed from webcam and then uses Google MediaPipe Library to detect body landmarks.

Using the calibration feature, users can have a personalized experience to make it work efficiently for them.


# Setup
**Clone the repository:**
**Create and activate a virtual environment:**
```bash
    # Create the environment
    python3 -m venv venv

    # Activate it on macOS/Linux
    source venv/bin/activate
    
    # Activate it on Windows
    # .\venv\Scripts\activate
```
**Install the required packages:**
```bash
    pip install -r requirements.txt
```

# How to use
Run 
```bash
    python main.py
```
Press C to calibrate posture
Press Q to quit application

# ToDo List
Add it so the user have to slouch for a certain amount of time for it to register (maybe 5-10 seconds then it will alert)

Maybe not a continuous use of webcam maybe only opens it every so often 5 minutes?

Track overall data to send 