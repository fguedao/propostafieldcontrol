document.getElementById('proposalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateProposal();
});

function generateProposal() {
    const companyName = document.getElementById('companyName').value;
    const clientName = document.getElementById('clientName').value;
    const dueDate = document.getElementById('dueDate').value;
    const teams = parseInt(document.getElementById('teams').value);

    const selectedProducts = [];
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function(product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        // Ajuste especial para produtos
        if (product.id === 'product2') { // Implantação
            annualPrice = price; // Valor fixo de R$299,00/ano
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * 12 * teams; // Multiplicar por 12 e quantidade de equipes
        } else if (product.id === 'product1') { // Painel de gestão
            annualPrice = price * 12; // Multiplicar por 12
        } else {
            annualPrice = price * 12; // Multiplicar apenas por 12 para os outros produtos
        }

        totalPrice += annualPrice;
        selectedProducts.push(`${product.nextElementSibling.textContent} - R$ ${annualPrice.toFixed(2)}`);
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    let proposalText = `
        <h2>Proposta Comercial</h2>
        <p><strong>Nome da Empresa:</strong> ${companyName}</p>
        <p><strong>Nome do Cliente:</strong> ${clientName}</p>
        <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
    `;

    proposalText += `
        <h3>Produtos Selecionados</h3>
        <ul>
    `;

    selectedProducts.forEach(function(product) {
        proposalText += `<li>${product}</li>`;
    });

    proposalText += `</ul>`;

    proposalText += `
        <p><strong>Total Anual (com desconto):</strong> R$ ${discountedPrice.toFixed(2)}</p>
        <p><strong>Data de Vencimento:</strong> ${dueDate}</p>
    `;

    document.getElementById('proposalOutput').innerHTML = proposalText;
}

function updateTotal() {
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function(product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        // Ajuste especial para produtos
        if (product.id === 'product2') { // Implantação
            annualPrice = price; // Valor fixo de R$299,00/ano
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * 12 * teams; // Multiplicar por 12 e quantidade de equipes
        } else if (product.id === 'product1') { // Painel de gestão
            annualPrice = price * 12; // Multiplicar por 12
        } else {
            annualPrice = price * 12; // Multiplicar apenas por 12 para os outros produtos
        }

        totalPrice += annualPrice;
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    document.getElementById('totalAmount').innerHTML = `
        <p><strong>Valor Total Anual:</strong> R$ ${discountedPrice.toFixed(2)}</p>
    `;
}

// Adiciona event listeners aos checkboxes e ao campo de equipes
document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', updateTotal);
});

document.getElementById('teams').addEventListener('input', updateTotal);
document.getElementById('discount').addEventListener('input', updateTotal);

// Atualiza o total na inicialização da página
updateTotal();
