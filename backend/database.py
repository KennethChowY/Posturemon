"""
Database Logger for Posture Tracking
"""

import sqlite3
import time

class DatabaseLogger:
    def __init__(self, db_name='posture_logs.db'):  # ← Changed from posture_data.db
        """Initialize database connection"""
        self.db_name = db_name
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()
        self.create_tables()
    
    def create_tables(self):
        """Create necessary tables if they don't exist"""
        # Users table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                created_at REAL NOT NULL
            )
        ''')
        
        # Posture logs table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS posture_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                timestamp REAL NOT NULL,
                posture_score REAL NOT NULL,
                status TEXT NOT NULL
            )
        ''')
        
        self.conn.commit()
    
    def get_or_create_user(self, username):
        """Get user ID or create new user"""
        self.cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
        result = self.cursor.fetchone()
        
        if result:
            return result[0]
        else:
            # Create new user
            timestamp = time.time()
            self.cursor.execute(
                'INSERT INTO users (username, created_at) VALUES (?, ?)',
                (username, timestamp)
            )
            self.conn.commit()
            return self.cursor.lastrowid
    
    def log(self, user_id, posture_score, status):
        """Log posture data"""
        timestamp = time.time()
        
        self.cursor.execute('''
            INSERT INTO posture_logs (user_id, timestamp, posture_score, status)
            VALUES (?, ?, ?, ?)
        ''', (user_id, timestamp, posture_score, status))
        
        self.conn.commit()
    
    def get_recent_logs(self, user_id, limit=10):
        """Get recent logs for a user"""
        self.cursor.execute('''
            SELECT timestamp, posture_score, status
            FROM posture_logs
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (user_id, limit))
        
        return self.cursor.fetchall()
    
    def close(self):
        """Close database connection"""
        self.conn.close()