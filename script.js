document.getElementById('proposalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    generateProposal();
});

function generateProposal() {
    const companyName = document.getElementById('companyName').value;
    const clientName = document.getElementById('clientName').value;
    const dueDate = document.getElementById('dueDate').value;
    const teams = parseInt(document.getElementById('teams').value);
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    const selectedProducts = [];
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        if (product.id === 'product2') { // Implantação
            annualPrice = price * 24.91; // Valor fixo multiplicado por 24.91
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * teams; // Multiplicar pela quantidade de equipes
        } else {
            annualPrice = price; // Para os outros produtos
        }

        totalPrice += annualPrice;
        selectedProducts.push(`${product.dataset.name} (anualizado) - R$ ${annualPrice.toFixed(2)}`);
    });

    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    let proposalText = `
        <h2>Proposta Comercial</h2>
        <p><strong>Nome da Empresa:</strong> ${companyName}</p>
        <p><strong>Nome do Cliente:</strong> ${clientName}</p>
        <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
        <p><strong>Total Anual:</strong> R$ ${totalPrice.toFixed(2)}</p>
    `;

    if (discount > 0) {
        proposalText += `
            <p><strong>Desconto:</strong> ${discount}%</p>
            <p><strong>Total com Desconto:</strong> R$ ${discountedPrice.toFixed(2)}</p>
        `;
    }

    proposalText += `
        <h3>Plano</h3>
        <ul>
    `;

    selectedProducts.forEach(function (product) {
        proposalText += `<li>${product}</li>`;
    });

    proposalText += `</ul>`;

    document.getElementById('proposalOutput').innerHTML = proposalText;
    displayPaymentOptions(discountedPrice, discount);
}

function displayPaymentOptions(totalAmount, discount) {
    const maxBoletos = 12;
    const minBoletoValue = 500;

    let cardInstallments = '';
    let boletoOptions = '';

    // Opção 1: Cartão de Crédito
    cardInstallments = `
        <div class="payment-option card">
            <p><strong>Opção 1:</strong> Parcelamento no Cartão de Crédito</p>
            <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
            <p><strong>Parcelamento em até 12x:</strong> R$ ${(totalAmount / 12).toFixed(2)} por mês</p>
        </div>
    `;

    // Calcular o número de boletos e valor de cada boleto
    let numBoletos = Math.floor(totalAmount / minBoletoValue);
    if (numBoletos > maxBoletos) {
        numBoletos = maxBoletos;
    } else if (numBoletos < 1) {
        numBoletos = 1;
    }

    let boletoAmount = totalAmount / numBoletos;

    boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
            <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
            <p><strong>Parcelamento em ${numBoletos} boletos:</strong></p>
            <p><strong>Valor de cada boleto:</strong> R$ ${boletoAmount.toFixed(2)}</p>
        </div>
    `;

    // Mensagem de atenção caso o desconto ultrapasse 15%
    let attentionMessage = '';
    if (discount > 15) {
        attentionMessage = `
            <div class="attention" style="color: red; font-weight: bold; margin-top: 20px;">
                <p><strong>Atenção:</strong> A proposta comercial corre o risco de não ser aprovada pela diretoria devido ao desconto elevado (${discount}%).</p>
            </div>
        `;
    }

    // Exibe as opções de pagamento
    document.getElementById('paymentDetails').innerHTML = `${cardInstallments}${boletoOptions}${attentionMessage}`;
}

function updateTotal() {
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        if (product.id === 'product2') { // Implantação
            annualPrice = price * 24.91; // Multiplicar por 24.91
        } else if (product.id === 'product3') { // Licença - Aplicativo do Colaborador
            annualPrice = price * teams; // Multiplicar pela quantidade de equipes
        } else {
            annualPrice = price; // Para os outros produtos
        }

        totalPrice += annualPrice;
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    document.getElementById('totalAmount').innerHTML = `
        <p><strong>Valor Total Anual:</strong> R$ ${discountedPrice.toFixed(2)}</p>
    `;
}

document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', updateTotal);
});

document.getElementById('teams').addEventListener('input', updateTotal);
document.getElementById('discount').addEventListener('input', updateTotal);
