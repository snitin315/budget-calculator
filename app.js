// BUDGET CONTROLLER 

var budgetController = (function(){
 
    let Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1 ;
    }


    Expense.prototype.calcPercentages = function(totalIncome){
        if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome)*100)
        } else{
            this.percentage = -1 ;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage ;
    }

    let Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value ;
        })

        data.totals[type] = sum ;
    }
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget : 0 ,
        percentage : -1
    }

    return {
        addItem : function(type, des, val){
         
            let newItem, ID

            
            //Create new ID
            if (data.allItems[type].length > 0){
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1 ;
            } else {
                ID = 0;
            }
            //Create new item based on income or expense

            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID,des,val)
            }
            
            //push the item to datastructer
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        },


        deleteItem: function(type,id){

            let ids,index;

             ids = data.allItems[type].map(function(current){
                return current.id ;
            });

             index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }



        },

        calculateBudget : function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp ;

            //calculate the % of incom that we spent
            if (data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }
        },


        calculatePercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentages(data.totals.inc);
            })

        },

        getPercentages : function(){
           

            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })

            return allPerc;
        },

        getBudget : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        }

    }
    
})();


// UI CONTROLLER 

let UIcontroller = (function(){

    let DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expensesLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage",
        container : ".container"

    }

    return  {
       getInput : function(){
           
           return {
              
            type : document.querySelector(DOMstrings.inputType).value , // either inc or exp
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
           }
        },


        addListItem: function(obj , type){
            
            var html, newHtml , element;

            //create html string with palceholder text
            if(type === 'inc'){
                 element = DOMstrings.incomeContainer;
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){
                 element = DOMstrings.expensesContainer;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the html into DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        
        },


        deleteListItem : function(selectorID){

            let el = document.getElementById(selectorID) ;
            el.parentNode.removeChild(el);
        },

        clearFields : function(){
            let fields , fieldsArr;

           fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
           fieldsArr = Array.prototype.slice.call(fields);
           fieldsArr.forEach(function(current, index, array){
              current.value = "";
           });

           fieldsArr[0].focus()
        },

        displayBudget : function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---"
            }
        },

        getDOMstrings : function(){
            return DOMstrings
        }
    }

})();


//GLOBAL APP CONTROLLER



let controller = (function(budgetCtrl,UIctrl){


    let setupEventListeners = function(){
    
    let DOM = UIctrl.getDOMstrings();    

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
       }
    })

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    }

    let updateBudget = function(){
        // calculate the budget
        budgetCtrl.calculateBudget();

        // return the budget
        let budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UIctrl.displayBudget(budget);
    }
    

    let updatePercentages = function(){
        // Calculate the percentages 
        budgetCtrl.calculatePercentages();
        //read % from budget controller
        var percentages = budgetCtrl.getPercentages();
        // update the UI with new percentages
        console.log(percentages);
    }

    let ctrlAddItem = function() {
     
        var newItem, input;
        // Get the input Data

        input = UIctrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            
        //add item to the budget controller 
        newItem = budgetCtrl.addItem(input.type, input.description , input.value);

        //add item to ui 
        UIctrl.addListItem(newItem, input.type)

        //clear the fields 
        UIctrl.clearFields();

        //calculate and update budget 
        updateBudget();

        //calculate and update %
        updatePercentages();

        }  

    }
    
    let ctrlDeleteItem = function(event){

       let itemID,splitID,type,ID;

       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;

       if (itemID){
        
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
       }

       //delete item from datastructure 
       budgetCtrl.deleteItem(type, ID);

       //delete item from UI

       UIctrl.deleteListItem(itemID);

       //update and show new budget
       updateBudget();

       //calculate & update % 
       updatePercentages();

    }
    
    return {
        init : function(){
            console.log('Application has started');
            UIctrl.displayBudget(
                {
                    budget : 0,
                    totalInc : 0,
                    totalExp : 0,
                    percentage : -1
                }
            )
            setupEventListeners();
        }
    }
    

})(budgetController,UIcontroller);

controller.init();