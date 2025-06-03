<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <a href="{{ env('FRONTEND_URL') }}/reset-password?token={{ $token }}" style="background-color:#4CAF50;border:none;color:white;padding:15px 32px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;cursor:pointer;">Reset Password</a>
    <p>If you did not request a password reset, no further action is required.</p>
</body>
</html>
