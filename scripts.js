const Modal = {
        open() {
            document.querySelector('.modal-overlay').classList.add('active')

        },
        close() {
            document.querySelector('.modal-overlay').classList.remove('active')
        }
    }
    // Guada os elementos das Transações

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finances")) || [];
    },
    set(transactions) {
        localStorage.setItem("finances", JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(valueTransaction) {
        Transaction.all.push(valueTransaction)
        App.reload()
    },

    remove(index) {
        alert("Tem certeza que deseja excluir o registro ?")
        Transaction.all.splice(index, 1)

        App.reload()
    },
    icomes() {
        //SOMAR AS ENTRADAS
        let income = 0;
        Transaction.all.forEach(value => {
            if (value.amount > 0) {
                income += value.amount
            }
        })
        return income;
    },
    expenses() {
        //SOMAR SAIDAS  
        let expense = 0;

        Transaction.all.forEach(value => {
            if (value.amount < 0) {
                expense += value.amount;
            }
        })
        return expense;
    },
    total() {
        //TOTAL
        return Transaction.icomes() + Transaction.expenses()
    }
}

//Pega as transações || SUBSTITUIR OS DADOS DO HTML COM O DO JS

const DOM = {
    //tag pai
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
            //Adiciona o index no html
        tr.dataset.index = index;
        DOM.transactionContainer.appendChild(tr) //tag flilha 


    },

    innerHTMLTransaction(transaction, index) {
        const valueCSS = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)

        const html =
            `            
                <td class="${valueCSS}">${transaction.description}</td>
                <td class=${valueCSS}>${amount}</td>
                <td class="${valueCSS}">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover Transação">
                </td>            
        `
        return html
    },
    updateBalance() {
        //PEga os valres das transações e colocar em TEla e formata para real
        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.icomes())
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

    },
    cleanTransaction() {
        DOM.transactionContainer.innerHTML = "";
    },
}

const Utils = {

    //FORMATA O NUMERO PARA INTEIRO, TIRANDO O PONTO CASO O USUARIO PASSE 
    formatAmount(value) {
        value = Number(value) * 100;
        return value;
    },
    formatDate(value) {
        valueDate = value.split("-");
        return `${valueDate[2]} / ${valueDate[1]} / ${valueDate[0]}`;
    },
    //Verifica se o numero é menor que 0 e se não tem letra, apos isso adiciona um - na frente e formarta para moeda
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value;
    }


}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFildes() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, Preencha todos os campos do formulario")
        }

        // console.log(amount)
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }

    },
    saveTransaction(valueTransaction) {
        Transaction.add(valueTransaction);
    },
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },


    submit(event) {
        event.preventDefault()

        try {

            Form.validateFildes()
            const transaction = Form.formatValues();
            Form.saveTransaction(transaction);
            Form.clearFields();
            Modal.close();
            alert("Inserido com Sucesso")


        } catch (error) {
            alert(error.message)
        }

    }
}


const App = {
    init() {
        Transaction.all.forEach((valor, index) => {
            DOM.addTransaction(valor, index);

        })

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.cleanTransaction()
        App.init()
    }
}

App.init()