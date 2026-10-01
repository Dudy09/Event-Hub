// Busca o endereço automaticamente a partir do CEP digitado (API ViaCEP)
document.addEventListener("DOMContentLoaded", () => {

    const campoCep = document.getElementById("cep");
    if (!campoCep) return; // essa página não tem campo de CEP, não faz nada

    const limparEndereco = () => {
        document.getElementById("rua").value = "";
        document.getElementById("bairro").value = "";
        document.getElementById("cidade").value = "";
        document.getElementById("estado").value = "";
    };

    campoCep.addEventListener("input", function () {
        const cep = this.value.replace(/\D/g, "");

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById("rua").value = data.logradouro;
                        document.getElementById("bairro").value = data.bairro;
                        document.getElementById("cidade").value = data.localidade;
                        document.getElementById("estado").value = data.uf;
                    } else {
                        limparEndereco();
                        alert("CEP não encontrado!");
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar CEP:", error);
                    limparEndereco();
                    alert("Erro ao buscar CEP. Verifique sua conexão!");
                });
        } else {
            limparEndereco();
        }
    });

});