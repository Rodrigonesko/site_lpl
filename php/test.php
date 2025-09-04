<?php
// Teste simples para verificar se o PHP está funcionando
echo "PHP está funcionando!<br>";
echo "Versão do PHP: " . phpversion() . "<br>";
echo "Data/Hora: " . date('d/m/Y H:i:s') . "<br>";

// Teste da função mail
if (function_exists('mail')) {
    echo "Função mail() está disponível<br>";
} else {
    echo "ATENÇÃO: Função mail() NÃO está disponível<br>";
}

// Verificar se o método POST está funcionando
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "Método POST recebido com sucesso!<br>";
    echo "Dados recebidos:<br>";
    foreach ($_POST as $key => $value) {
        echo htmlspecialchars($key) . ": " . htmlspecialchars($value) . "<br>";
    }
} else {
    echo "Para testar o POST, envie dados via formulário.<br>";
}
?>
