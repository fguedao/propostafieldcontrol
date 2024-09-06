document.getElementById('proposalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    generateProposal();
});

// Constantes para valores fixos
const IMPLANTACAO_FIXA = 299;

function generateProposal() {
    const companyName = document.getElementById('companyName').value;
    const clientName = document.getElementById('clientName').value;
    const dueDate = document.getElementById('dueDate').value;
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    // Validação simples de campos obrigatórios
    if (!companyName || !clientName || !dueDate) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const selectedProducts = [];
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    // Calcular o valor total
    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        switch (product.id) {
            case 'product2': // Implantação - valor fixo de R$299,00
                annualPrice = IMPLANTACAO_FIXA;
                break;
            case 'product3': // Licença - Aplicativo do Colaborador
                annualPrice = price * teams * 12;
                break;
            case 'product1': // Painel de gestão
                annualPrice = price * 12;
                break;
            default: // Outros módulos
                annualPrice = price * 12;
        }

        totalPrice += annualPrice;
        selectedProducts.push(`${product.dataset.name} - ${formatCurrency(annualPrice)}`);
    });

    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    // Geração da proposta
    let proposalText = `
        <h2>Proposta Comercial</h2>
        <p><strong>Nome da Empresa:</strong> ${companyName}</p>
        <p><strong>Nome do Cliente:</strong> ${clientName}</p>
        <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
        <p><strong>Total Anual:</strong> ${formatCurrency(totalPrice)}</p>
    `;

    if (discount > 0) {
        proposalText += `
            <p><strong>Desconto:</strong> ${discount}%</p>
            <p><strong>Total com Desconto:</strong> ${formatCurrency(discountedPrice)}</p>
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

    // Opção 1: Cartão de Crédito
    let cardInstallments = `
        <div class="payment-option card">
            <p><strong>Opção 1:</strong> Parcelamento no Cartão de Crédito</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <label for="cardInstallments">Escolha o número de parcelas:</label>
            <select id="cardInstallments" name="cardInstallments">
    `;

    for (let i = 1; i <= 12; i++) {
        cardInstallments += `<option value="${i}">${i}x</option>`;
    }

    cardInstallments += `
            </select>
            <p id="cardInstallmentsAmount"></p>
        </div>
    `;

    // Opção 2: Boleto Bancário
    let boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Parcelamento em Boletos</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <label for="boletoInstallments">Escolha o número de boletos:</label>
            <select id="boletoInstallments" name="boletoInstallments">
    `;

    for (let i = 1; i <= maxBoletos; i++) {
        boletoOptions += `<option value="${i}">${i}x</option>`;
    }

    boletoOptions += `
            </select>
            <p id="boletoInstallmentsAmount"></p>
        </div>
    `;

    let attentionMessage = '';
    if (discount > 15) {
        attentionMessage = `
            <div class="attention" style="color: red; font-weight: bold; margin-top: 20px;">
                <p><strong>Atenção:</strong> A proposta comercial corre o risco de não ser aprovada pela diretoria devido ao desconto elevado (${discount}%).</p>
            </div>
        `;
    }

    document.getElementById('paymentDetails').innerHTML = `${cardInstallments}${boletoOptions}${attentionMessage}`;
    
    // Atualizar valores das parcelas ao mudar seleção
    document.getElementById('cardInstallments').addEventListener('change', function () {
        updateInstallments(this.value, totalAmount, 'cardInstallmentsAmount');
    });

    document.getElementById('boletoInstallments').addEventListener('change', function () {
        updateInstallments(this.value, totalAmount, 'boletoInstallmentsAmount');
    });
}

// Função para atualizar o valor das parcelas
function updateInstallments(installments, totalAmount, elementId) {
    const amountPerInstallment = formatCurrency(totalAmount / parseInt(installments));
    document.getElementById(elementId).innerText = `Valor de cada parcela: ${amountPerInstallment}`;
}

// Função para formatar valores em moeda
function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para atualizar o valor total ao mudar inputs
function updateTotal() {
    const teams = parseInt(document.getElementById('teams').value) || 1;
    const productElements = document.querySelectorAll('input[type="checkbox"]:checked');
    let totalPrice = 0;

    productElements.forEach(function (product) {
        const price = parseFloat(product.dataset.price);
        let annualPrice;

        switch (product.id) {
            case 'product2': // Implantação
                annualPrice = IMPLANTACAO_FIXA;
                break;
            case 'product3': // Licença - Aplicativo do Colaborador
                annualPrice = price * teams * 12;
                break;
            case 'product1': // Painel de gestão
                annualPrice = price * 12;
                break;
            default:
                annualPrice = price * 12;
        }

        totalPrice += annualPrice;
    });

    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));

    document.getElementById('totalAmount').innerHTML = `
        <p><strong>Valor Total Anual:</strong> ${formatCurrency(discountedPrice)}</p>
    `;
}

// Atualizar o total sempre que houver mudança nos inputs
document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', updateTotal);
});
document.getElementById('teams').addEventListener('input', updateTotal);
document.getElementById('discount').addEventListener('input', updateTotal);

document.getElementById('printProposalButton').addEventListener('click', function () {
    openProposalInNewPage();
});
// código para abrir uma nova tela com a proposta comercial


document.getElementById('printProposalButton').addEventListener('click', function () {
    openProposalInNewPage();
});

function openProposalInNewPage() {
    const proposalContent = document.getElementById('proposalOutput').innerHTML;
    const dueDate = document.getElementById('dueDate').value; // Pega o valor da data de vencimento

    // Verifique se há conteúdo de proposta antes de abrir a nova página
    if (!proposalContent) {
        alert('Por favor, gere a proposta antes de visualizar.');
        return;
    }

    // Converter a data para o formato DD/MM/AAAA
    const dueDateFormatted = formatDateToBR(dueDate);

    // Abrir nova janela
    const newWindow = window.open('', '_blank', 'width=800,height=600');

    // Verificar se o pop-up foi bloqueado
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('Desative o bloqueador de pop-ups e tente novamente.');
        return;
    }

    const styles = `
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
            h2 { text-align: center; }
            p { font-size: 14px; line-height: 1.6; margin-bottom: 10px; }
            ul { list-style-type: none; padding: 0; }
            ul li { background-color: #e9e9e9; margin-bottom: 5px; padding: 10px; border-radius: 4px; }
            .proposal { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .proposal h2 { color: #333; }
            .total { font-weight: bold; font-size: 16px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
        </style>
    `;

    // Conteúdo da nova página
    const newWindowContent = `
        <html>
            <head>
                <title>Proposta Comercial</title>
                ${styles}
            </head>
            <body>
                <div class="proposal">
                    ${proposalContent}
                    <div class="footer">
                        <p>Esta proposta é válida até ${dueDateFormatted}.</p>
                        <p>Field Control - Soluções para Gestão de Equipes de Campo</p>
                    </div>
                </div>
            </body>
        </html>
    `;

    // Escrever o conteúdo na nova janela
    newWindow.document.write(newWindowContent);
    newWindow.document.close(); // Fecha o documento para garantir o carregamento
    newWindow.focus(); // Focar na nova janela
}

// Função para formatar a data para o formato DD/MM/AAAA
function formatDateToBR(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

