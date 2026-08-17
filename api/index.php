<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

$root = dirname(__DIR__);
$credFile = $root . '/cms/credentials.json';
$contentFile = $root . '/public/content.json';
$leadsFile = $root . '/public/leads.json';

function read_json($file, $fallback) {
  if (!file_exists($file)) return $fallback;
  $data = json_decode(file_get_contents($file), true);
  return is_array($data) ? $data : $fallback;
}

function write_json($file, $data) {
  $dir = dirname($file);
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function body() {
  $raw = file_get_contents('php://input');
  $json = json_decode($raw, true);
  return is_array($json) ? $json : [];
}

function send($code, $data) {
  http_response_code($code);
  echo json_encode($data);
  exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($path === '/api/login' && $method === 'POST') {
  $creds = read_json($credFile, ['username' => 'livraison91', 'code' => 'Express91!']);
  $b = body();
  if (($b['username'] ?? '') !== $creds['username'] || ($b['code'] ?? '') !== $creds['code']) {
    send(401, ['ok' => false, 'error' => 'Identifiants incorrects.']);
  }
  $_SESSION['lx'] = true;
  send(200, ['ok' => true, 'token' => session_id()]);
}

if ($path === '/api/session' && $method === 'GET') {
  send(200, ['ok' => !empty($_SESSION['lx'])]);
}

if ($path === '/api/content' && $method === 'GET') {
  send(200, ['ok' => true, 'content' => read_json($contentFile, new stdClass())]);
}

if ($path === '/api/content' && $method === 'POST') {
  if (empty($_SESSION['lx'])) send(401, ['ok' => false, 'error' => 'Session expirée.']);
  $b = body();
  if (!isset($b['content']) || !is_array($b['content'])) send(400, ['ok' => false, 'error' => 'Contenu manquant.']);
  write_json($contentFile, $b['content']);
  send(200, ['ok' => true]);
}

if ($path === '/api/credentials' && $method === 'POST') {
  if (empty($_SESSION['lx'])) send(401, ['ok' => false, 'error' => 'Session expirée.']);
  $b = body();
  $u = trim($b['username'] ?? '');
  $c = $b['code'] ?? '';
  if (strlen($u) < 4 || strlen($c) < 6) send(400, ['ok' => false, 'error' => 'Identifiant trop court.']);
  write_json($credFile, ['username' => $u, 'code' => $c]);
  send(200, ['ok' => true]);
}

if ($path === '/api/leads' && $method === 'GET') {
  if (empty($_SESSION['lx'])) send(401, ['ok' => false, 'error' => 'Session expirée.']);
  send(200, ['ok' => true, 'leads' => read_json($leadsFile, [])]);
}

if ($path === '/api/leads' && $method === 'POST') {
  $b = body();
  $lead = [
    'id' => bin2hex(random_bytes(8)),
    'createdAt' => date('c'),
    'name' => substr($b['name'] ?? '', 0, 80),
    'phone' => substr($b['phone'] ?? '', 0, 30),
    'direction' => substr($b['direction'] ?? '', 0, 40),
    'weight' => substr($b['weight'] ?? '', 0, 12),
    'cityFrom' => substr($b['cityFrom'] ?? '', 0, 60),
    'cityTo' => substr($b['cityTo'] ?? '', 0, 60),
    'message' => substr($b['message'] ?? '', 0, 800),
    'prefer' => substr($b['prefer'] ?? 'whatsapp', 0, 20),
  ];
  if ($lead['name'] === '' || $lead['phone'] === '') send(400, ['ok' => false, 'error' => 'Nom et téléphone requis.']);
  $leads = read_json($leadsFile, []);
  array_unshift($leads, $lead);
  write_json($leadsFile, array_slice($leads, 0, 200));
  send(200, ['ok' => true, 'id' => $lead['id']]);
}

send(404, ['ok' => false, 'error' => 'Not found']);
