<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

if (!isset($_POST['submit'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Requisição inválida']);
    exit;
}

// Função para sanitizar dados
function sanitizeInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Validação e sanitização dos campos obrigatórios
$errors = [];

// Nome
if (empty($_POST['name'])) {
    $errors[] = 'Nome é obrigatório';
} else {
    $nome = sanitizeInput($_POST['name']);
    if (strlen($nome) < 2) {
        $errors[] = 'Nome deve ter pelo menos 2 caracteres';
    }
}

// Email
if (empty($_POST['email'])) {
    $errors[] = 'Email é obrigatório';
} else {
    $email = sanitizeInput($_POST['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }
}

// Assunto
if (empty($_POST['subject'])) {
    $errors[] = 'Assunto é obrigatório';
} else {
    $subject = sanitizeInput($_POST['subject']);
}

// Mensagem
if (empty($_POST['message'])) {
    $errors[] = 'Mensagem é obrigatória';
} else {
    $mensagem = sanitizeInput($_POST['message']);
    if (strlen($mensagem) < 10) {
        $errors[] = 'Mensagem deve ter pelo menos 10 caracteres';
    }
}

// Telefone (opcional)
$phone = !empty($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';

// Se há erros, retorna erro
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Configurações do email
$to = "rodrigo.dias@lplseguros.com.br";
$emailSubject = "Contato do Site - " . $subject;

// Corpo do email
$body = "Nova mensagem recebida do site LPL Assessoria:\n\n";
$body .= "Nome: " . $nome . "\n";
$body .= "Email: " . $email . "\n";
if (!empty($phone)) {
    $body .= "Telefone: " . $phone . "\n";
}
$body .= "Assunto: " . $subject . "\n";
$body .= "Mensagem:\n" . $mensagem . "\n\n";
$body .= "Enviado em: " . date('d/m/Y H:i:s') . "\n";

// Headers do email
$headers = [];
$headers[] = 'From: Site LPL <noreply@lplseguros.com.br>';
$headers[] = 'Reply-To: ' . $nome . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$headerString = implode("\r\n", $headers);

// Tentativa de envio
try {
    if (mail($to, $emailSubject, $body, $headerString)) {
        echo json_encode([
            'success' => true,
            'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        ]);
    } else {
        throw new Exception('Falha no envio do email');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor. Tente novamente mais tarde.'
    ]);
}
