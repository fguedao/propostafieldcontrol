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
    displayPaymentOptions(discountedPrice);
}

function displayPaymentOptions(totalAmount) {
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

    // Opção 2: Boleto Bancário
    let numBoletos = Math.ceil(totalAmount / minBoletoValue);
    numBoletos = Math.min(numBoletos, maxBoletos);

    let boletoAmount = totalAmount / numBoletos;
    if (boletoAmount < minBoletoValue && numBoletos < maxBoletos) {
        boletoAmount = minBoletoValue;
        const remainingAmount = totalAmount - (minBoletoValue * (numBoletos - 1));
        boletoOptions = `
            <div class="payment-option boleto">
                <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
                <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
                <p><strong>Divida o valor total em até ${maxBoletos} boletos:</strong></p>
                <p><strong>Valor de cada boleto:</strong> R$ ${minBoletoValue.toFixed(2)}</p>
                <p><strong>Último boleto:</strong> R$ ${remainingAmount.toFixed(2)}</p>
            </div>
        `;
    } else {
        boletoOptions = `
            <div class="payment-option boleto">
                <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
                <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
                <p><strong>Divida o valor total em até ${maxBoletos} boletos:</strong></p>
                <p><strong>Valor de cada boleto:</strong> R$ ${boletoAmount.toFixed(2)}</p>
            </div>
        `;
    }

    let attentionMessage = '';
    if (discount > 15) {
        attentionMessage = `
            <div class="attention">
                <p><strong>Atenção:</strong> Devido ao desconto aplicado, esta proposta está sujeita à revisão pela diretoria.</p>
            </div>
        `;
    }

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

document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', updateTotal);
});

document.getElementById('teams').addEventListener('input', updateTotal);
document.getElementById('discount').addEventListener('input', updateTotal);

function displayPaymentOptions(totalAmount) {
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
    }
    if (numBoletos < 1) {
        numBoletos = 1;
    }

    let boletoAmount = totalAmount / numBoletos;

    // Garantir que o valor de cada boleto seja igual e maior ou igual a R$ 500
    boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
            <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
            <p><strong>Parcelamento em ${numBoletos} boletos:</strong></p>
            <p><strong>Valor de cada boleto:</strong> R$ ${boletoAmount.toFixed(2)}</p>
        </div>
    `;

    let attentionMessage = '';
    if (discount > 15) {
        attentionMessage = `
            <div class="attention">
                <p><strong>Atenção:</strong> Devido ao desconto aplicado, esta proposta está sujeita à revisão pela diretoria.</p>
            </div>
        `;
    }

    document.getElementById('paymentDetails').innerHTML = `${cardInstallments}${boletoOptions}${attentionMessage}`;
}

function displayPaymentOptions(totalAmount) {
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
    }
    if (numBoletos < 1) {
        numBoletos = 1;
    }

    let boletoAmount = totalAmount / numBoletos;

    // Garantir que o valor de cada boleto seja igual e maior ou igual a R$ 500
    boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
            <p><strong>Total Anual:</strong> R$ ${totalAmount.toFixed(2)}</p>
            <p><strong>Parcelamento em ${numBoletos} boletos:</strong></p>
            <p><strong>Valor de cada boleto:</strong> R$ ${boletoAmount.toFixed(2)}</p>
        </div>
    `;

    // Verifica se o desconto ultrapassa 15% e exibe mensagem em vermelho
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
