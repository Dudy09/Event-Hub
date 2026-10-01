function validarCPF(cpf) {
    cpf = String(cpf).replace(/[^0-9]/g, '');

    // tamanho errado ou todos os dígitos iguais (111.111.111-11 etc.) => inválido
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    const n = cpf.split('').map(Number);

    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += n[i] * (10 - i);
    }
    let dgt1 = 11 - (soma1 % 11);
    if (dgt1 >= 10) dgt1 = 0;

    let soma2 = 0;
    for (let i = 0; i < 9; i++) {
        soma2 += n[i] * (11 - i);
    }
    soma2 += dgt1 * 2;
    let dgt2 = 11 - (soma2 % 11);
    if (dgt2 >= 10) dgt2 = 0;

    return dgt1 === n[9] && dgt2 === n[10];
}

function validarCNPJ(cnpj) {
    cnpj = String(cnpj).replace(/[^0-9]/g, '');

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = (soma % 11) < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== Number(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = (soma % 11) < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== Number(digitos.charAt(1))) return false;

    return true;
}