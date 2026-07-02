<?php
header('Content-Type: application/json');

// Ativar logs detalhados para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
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

// Validação dos campos (mesmo código anterior)
$errors = [];

if (empty($_POST['name'])) {
    $errors[] = 'Nome é obrigatório';
} else {
    $nome = sanitizeInput($_POST['name']);
    if (strlen($nome) < 2) {
        $errors[] = 'Nome deve ter pelo menos 2 caracteres';
    }
}

if (empty($_POST['email'])) {
    $errors[] = 'Email é obrigatório';
} else {
    $email = sanitizeInput($_POST['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }
}

if (empty($_POST['subject'])) {
    $errors[] = 'Assunto é obrigatório';
} else {
    $subject = sanitizeInput($_POST['subject']);
}

if (empty($_POST['message'])) {
    $errors[] = 'Mensagem é obrigatória';
} else {
    $mensagem = sanitizeInput($_POST['message']);
    if (strlen($mensagem) < 10) {
        $errors[] = 'Mensagem deve ter pelo menos 10 caracteres';
    }
}

$phone = !empty($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // CONFIGURAÇÕES CORRETAS PARA LOCAWEB
    $mail->isSMTP();
    $mail->SMTPDebug = 0; // Mudar para 2 para debug detalhado

    // Configurações SMTP da Locaweb (TESTANDO MÚLTIPLAS OPÇÕES)
    $mail->Host = 'email-ssl.com.br';
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply@lplseguros.com.br';
    $mail->Password = 'No#$641R'; // SUBSTITUA pela senha real

    // Tentar SSL primeiro (porta 465)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Configurações adicionais para Locaweb
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    $mail->Timeout = 60;
    $mail->SMTPKeepAlive = true;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // Configurações do email
    $mail->setFrom('noreply@lplseguros.com.br', 'Site LPL Assessoria');
    $mail->addAddress('rodrigo.dias@lplseguros.com.br', 'Rodrigo Dias');
    $mail->addReplyTo($email, $nome);

    // Conteúdo do email
    $mail->isHTML(false);
    $mail->Subject = "Contato do Site - " . $subject;

    $body = "Nova mensagem recebida do site LPL Assessoria:\n\n";
    $body .= "Nome: " . $nome . "\n";
    $body .= "Email: " . $email . "\n";
    if (!empty($phone)) {
        $body .= "Telefone: " . $phone . "\n";
    }
    $body .= "Assunto: " . $subject . "\n";
    $body .= "Mensagem:\n" . $mensagem . "\n\n";
    $body .= "Enviado em: " . date('d/m/Y H:i:s') . "\n";
    $body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "Servidor: " . $_SERVER['SERVER_NAME'] . "\n";

    $mail->Body = $body;

    $result = $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'debug' => 'Email enviado via ' . $mail->Host . ':' . $mail->Port
    ]);
} catch (Exception $e) {

    // Se SSL falhar, tentar TLS na porta 587
    if (strpos($e->getMessage(), 'SSL') !== false || strpos($e->getMessage(), '465') !== false) {
        try {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->send();

            echo json_encode([
                'success' => true,
                'message' => 'Mensagem enviada com sucesso! (via TLS)',
                'debug' => 'Email enviado via TLS porta 587'
            ]);
        } catch (Exception $e2) {
            // Se TLS também falhar, tentar sem criptografia
            try {
                $mail->SMTPSecure = false;
                $mail->SMTPAutoTLS = false;
                $mail->Port = 25;

                $mail->send();

                echo json_encode([
                    'success' => true,
                    'message' => 'Mensagem enviada com sucesso! (sem criptografia)',
                    'debug' => 'Email enviado via porta 25'
                ]);
            } catch (Exception $e3) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Erro ao enviar email após múltiplas tentativas.',
                    'error' => $e3->getMessage(),
                    'debug' => 'Todas as configurações SMTP falharam'
                ]);
            }
        }
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao enviar email.',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => basename($e->getFile())
        ]);
    }
}
