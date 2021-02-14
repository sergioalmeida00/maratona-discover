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

            if (value.category == "C") {
                income += value.amount
            }

        })

        return income;
    },
    expenses() {
        //SOMAR SAIDAS  
        let expense = 0;

        Transaction.all.forEach(value => {
            if (value.category == "D") {
                expense += value.amount * (-1)
            }

        })
        return expense;
    },
    total() {
        //TOTAL
        return Transaction.icomes() + Transaction.expenses()
    },
    category() {
        let select = document.querySelector('#category');
        let valueCategory = select.options[select.selectedIndex].value;
        return valueCategory;
    }
}



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
        const valueCSS = transaction.category == "C" ? "income" : "expense"
        const signal = transaction.category == "D" ? "-" : "";
        const amount = Utils.formatCurrency(transaction.amount)

        const html =
            `            
                <td class="${valueCSS}">${transaction.description}</td>
                <td class=${valueCSS}> ${signal} ${amount}</td>
                <td class="${valueCSS}">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover Transação">
                </td>            
        `
        return html
    },
    updateBalance() {

        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.icomes())
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

    },
    cleanTransaction() {
        DOM.transactionContainer.innerHTML = "";
    },
}

const Utils = {


    formatAmount(value) {
        value = Number(value) * 100;

        return value;
    },
    formatDate(value) {
        valueDate = value.split("-");
        return `${valueDate[2]}/${valueDate[1]}/${valueDate[0]}`;
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
    category: Transaction.category(),


    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value.replace("-", ""),
            date: Form.date.value,
            category: Transaction.category(),

        }
    },

    validateFildes() {
        const { description, amount, date, category } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "" || category.trim() === "") {

            throw new Error("Por favor, Preencha todos os campos do formulario")
        }

    },
    formatValues() {
        let { description, amount, date, category } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date,
            category,
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