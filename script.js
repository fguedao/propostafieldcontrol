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
        selectedProducts.push(`${product.dataset.name} (anualizado) - R$ ${annualPrice.toFixed(2)}`);
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    let proposalText = `
        <h2>Proposta Comercial</h2>
        <p><strong>Nome da Empresa:</strong> ${companyName}</p>
        <p><strong>Nome do Cliente:</strong> ${clientName}</p>
        <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
        <h3>Produtos Selecionados</h3>
        <ul>
    `;

    selectedProducts.forEach(function(product) {
        proposalText += `<li>${product}</li>`;
    });

    proposalText += `</ul>`;

    // Valor original e valor com desconto
    proposalText += `<p><strong>Total Anual:</strong> R$ ${totalPrice.toFixed(2)}</p>`;
    if (discount > 0) {
        proposalText += `<p><strong>Total Anual (com desconto):</strong> R$ ${discountedPrice.toFixed(2)}</p>`;
    }

    // Alerta se o desconto for maior que 15%
    if (discount > 15) {
        proposalText += `<p style="color: red;"><strong>Atenção:</strong> O desconto excede 15%. A proposta comercial correrá o risco de não ser aprovada pela diretoria.</p>`;
    }

    proposalText += `<p><strong>Data de Vencimento:</strong> ${formatDate(dueDate)}</p>`;

    document.getElementById('proposalOutput').innerHTML = proposalText;

    // Mostrar opções de pagamento com o valor correto
    displayPaymentOptions(discount > 0 ? discountedPrice : totalPrice);
}

function displayPaymentOptions(total) {
    const minBoletoValue = 500;
    let paymentOptions = '';

    // Opção 1: Cartão de Crédito
    const creditCardInstallments = total / 12;
    paymentOptions += `<h3>Opções de Pagamento</h3>`;
    paymentOptions += `<p><strong>Opção 1:</strong> Parcelamento em até 12x no Cartão de Crédito. Cada parcela será de R$ ${creditCardInstallments.toFixed(2)}.</p>`;

    // Opção 2: Boletos
    paymentOptions += `<p><strong>Opção 2:</strong> Parcelamento em Boletos</p>`;
    
    let maxBoletos = Math.floor(total / minBoletoValue);
    let boletoValue = total / maxBoletos;

    if (boletoValue < minBoletoValue) {
        maxBoletos--;
        boletoValue = total / maxBoletos;
    }

    paymentOptions += `<p>O valor total será dividido em ${maxBoletos} boletos de R$ ${boletoValue.toFixed(2)}.</p>`;

    document.getElementById('paymentDetails').innerHTML = paymentOptions;
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

document.getElementById('proposalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateProposal();
});
