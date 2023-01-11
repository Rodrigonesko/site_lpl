<?php

if (isset($_POST['submit'])) {
    if (isset($_POST['email']) && !empty($_POST['email'])) {
        $nome = addcslashes($_POST['name'], "A..z");
        $email = addcslashes($_POST['email'], "A..z");
        $mensagem = addcslashes($_POST['message'],  "A..z");
        $phone = addcslashes($_POST['phone'],  "A..z");
    }

    $to = "rodrigo.dias@lplseguros.com.br";
    $subject = $_POST['subject'];
    $body = "Nome: " . $nome . "\r\n" .
        "Email: " . $email . "\r\n" .
        "Phone:" . $phone . "\r\n" .
        "Mensagem: " . $mensagem;

    $header = "From:rodrigo.dias@lplseguros.com.br" . "\r\n" . "Reply-to:" . $email . "\r\n" . "X=Mailer:PHP/" . phpversion();

    if (mail($to, $subject, $body, $header)) {
        echo "email enviado com sucesso";
    } else {
        echo "O email não pode ser enviado";
    }
}
