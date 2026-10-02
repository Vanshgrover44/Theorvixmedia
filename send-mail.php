<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$privacy = (string)($_POST['privacy'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $privacy !== '1') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

// Keep the recipient on the business domain.
$to = 'Info@theorvixmedia.com';
$subject = 'New Project Enquiry - Orvix Media';
$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$safeEmail = preg_replace('/[\r\n]+/', '', $email);
$body = "New project enquiry from Orvix Media website\n\n" .
        "Name: {$safeName}\n" .
        "Email: {$safeEmail}\n\n" .
        "Project details:\n{$message}\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Orvix Media <Info@theorvixmedia.com>',
    'Reply-To: ' . $safeEmail,
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail server could not accept the message.']);
    exit;
}

echo json_encode(['success' => true]);
