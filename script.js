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
        <div class="proposal-info">
            <p><strong>Nome da Empresa:</strong> ${companyName}</p>
            <p><strong>Nome do Cliente:</strong> ${clientName}</p>
            <p><strong>Data de Vencimento:</strong> ${formatDateBR(dueDate)}</p>
            <p><strong>Quantidade de Equipes de Campo:</strong> ${teams}</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalPrice)}</p>
        </div>
    `;

    if (discount > 0) {
        proposalText += `
            <p><strong>Desconto:</strong> ${discount}%</p>
            <p><strong>Total com Desconto:</strong> ${formatCurrency(discountedPrice)}</p>
        `;
    }

    // Estilo do plano
    proposalText += `
        <h3>Plano</h3>
        <ul style="padding: 0; list-style: none; margin-bottom: 10px;">
    `;

    selectedProducts.forEach(function (product) {
        proposalText += `<li style="background-color: #f9f9f9; padding: 5px 10px; margin-bottom: 3px; border-radius: 4px; font-size: 14px;">${product}</li>`;
    });

    proposalText += `</ul>`;

    document.getElementById('proposalOutput').innerHTML = proposalText;
    displayPaymentOptions(discountedPrice, discount);
}

function displayPaymentOptions(totalAmount, discount) {
    const maxInstallments = 12;
    let boletoInstallments = 1;

    // Opção 1: Cartão de Crédito - fixo em até 12 parcelas
    let cardInstallments = `
        <div class="payment-option card">
            <p><strong>Opção 1:</strong> Parcelamento no Cartão de Crédito</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <p><strong>Parcelamento:</strong> até 12x de ${formatCurrency(totalAmount / maxInstallments)}</p>
        </div>
    `;

    // Opção 2: Boleto Bancário com seletor de parcelas
    let boletoOptions = `
        <div class="payment-option boleto">
            <p><strong>Opção 2:</strong> Pagamento via Boleto</p>
            <p><strong>Total Anual:</strong> ${formatCurrency(totalAmount)}</p>
            <label for="boletoInstallments">Escolha o número de boletos:</label>
            <select id="boletoInstallments" name="boletoInstallments">
    `;

    for (let i = 1; i <= maxInstallments; i++) {
        boletoOptions += `<option value="${i}" ${i == boletoInstallments ? 'selected' : ''}>${i}x</option>`;
    }

    boletoOptions += `
            </select>
            <p id="boletoInstallmentsAmount">Parcelamento em ${boletoInstallments}x de ${formatCurrency(totalAmount / boletoInstallments)}</p>
        </div>
    `;

    document.getElementById('paymentDetails').innerHTML = `${cardInstallments}${boletoOptions}`;

    // Atualizar o valor das parcelas ao selecionar uma nova quantidade de boletos
    document.getElementById('boletoInstallments').addEventListener('change', function () {
        boletoInstallments = parseInt(this.value);
        const installmentValue = totalAmount / boletoInstallments;

        // Verificar se o valor da parcela é menor que 500 reais
        if (installmentValue < 500) {
            alert("O valor mínimo de cada parcela deve ser de R$500. O número de parcelas foi ajustado.");
            // Ajusta automaticamente para o número de parcelas que deixa a parcela maior ou igual a R$500
            boletoInstallments = Math.floor(totalAmount / 500);
            this.value = boletoInstallments; // Ajustar a seleção
        }

        // Exibe o valor atualizado das parcelas
        document.getElementById('boletoInstallmentsAmount').innerText = `Parcelamento em ${boletoInstallments}x de ${formatCurrency(totalAmount / boletoInstallments)}`;
    });
}

// Função para formatar valores em moeda
function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para formatar a data no formato brasileiro
function formatDateBR(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Função para abrir a nova página com a proposta comercial
document.getElementById('printProposalButton').addEventListener('click', function () {
    openProposalInNewPage();
});

// Função para abrir a nova janela com a proposta comercial
// Função para abrir a nova janela com a proposta comercial
function openProposalInNewPage() {
    const proposalContent = document.getElementById('proposalOutput').innerHTML;
    const paymentDetails = document.getElementById('paymentDetails').innerHTML;

    // Verifique se há conteúdo de proposta antes de abrir a nova página
    if (!proposalContent) {
        alert('Por favor, gere a proposta antes de visualizar.');
        return;
    }

    // Abrir nova janela
    const newWindow = window.open('', '_blank', 'width=900,height=800');

    // Verificar se o pop-up foi bloqueado
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('Desative o bloqueador de pop-ups e tente novamente.');
        return;
    }

    // Remover o seletor de quantidade de boletos e a frase 'Escolha o número de boletos' da visualização
    const paymentDetailsWithoutSelect = paymentDetails.replace(/<label[\s\S]*?<\/label>\s*<select[\s\S]*?<\/select>/, '');

    // Remover a mensagem de atenção da segunda página (caso exista na primeira)
    const paymentDetailsWithoutAttention = paymentDetailsWithoutSelect.replace(/<div class="attention"[\s\S]*?<\/div>/, '');

    // Estilo da página 2 com layout harmonizado e mais compacto
    const styles = `
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                line-height: 1.4;
                padding: 15px;
                margin: 0;
            }
            .proposal-content {
                max-width: 800px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #e1e5eb;
            }
            h2 {
                font-size: 1.5rem;
                font-weight: 500;
                color: #007bff;
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #007bff;
                padding-bottom: 8px;
            }
            .proposal-info {
                margin-bottom: 15px;
                font-size: 1rem;
                color: #495057;
            }
            .proposal-info p {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #e1e5eb;
                padding: 6px 0;
                font-size: 0.95rem;
            }
            .proposal-info p strong {
                color: #007bff;
                font-weight: 600;
            }
            ul {
                list-style-type: none;
                padding: 0;
                margin-top: 10px;
            }
            ul li {
                background-color: #fff;
                border: 1px solid #e1e5eb;
                border-radius: 6px;
                padding: 10px 12px;
                margin-bottom: 8px;
                font-size: 0.95rem;
                color: #495057;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            #paymentDetails {
                margin-top: 20px;
                padding: 15px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #e1e5eb;
            }
            .payment-option {
                padding: 12px;
                margin-bottom: 15px;
                border: 1px solid #e1e5eb;
                border-radius: 8px;
                background-color: #f8f9fa;
            }
            .payment-option:hover {
                background-color: #f1f3f5;
            }
            .payment-option p {
                font-size: 0.95rem;
                color: #495057;
                margin: 6px 0;
                line-height: 1.4;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 0.85rem;
                color: #777;
            }
        </style>
    `;

    // Conteúdo a ser exibido na nova janela sem o seletor de quantidade de boletos e sem a mensagem de atenção
    const newWindowContent = `
        <html>
            <head>
                <title>Proposta Comercial</title>
                ${styles}
            </head>
            <body>
                <div class="proposal-content">
                    ${proposalContent}
                    <div id="paymentDetails">
                        <h3>Detalhes do Pagamento</h3>
                        ${paymentDetailsWithoutAttention}
                    </div>
                    <div class="footer">
                        <p>Esta proposta é válida até a data de vencimento. Após essa data, poderá ser alterada.</p>
                        <p>Field Control - Soluções para Gestão de Equipes de Campo</p>
                    </div>
                </div>
            </body>
        </html>
    `;

    // Escrever o conteúdo na nova janela
    newWindow.document.write(newWindowContent);
    newWindow.document.close();
    newWindow.focus();
}

