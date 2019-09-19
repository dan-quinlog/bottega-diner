const order = [];

function orderUp() {
    let response = document.getElementById('input').value.toLowerCase();
    //check for main item
    //-> check for ingredients -> add or remove
    //-> chips / cookie / drink
    //check for multiple main item -> repeat if needed
    //ask if any other items are needed -> repeat if needed
    //input reader allmight!!!
    const queue = [];
    for ( var i = 0 ; i < response.length ; i++ ) {
        const queue_check = action_items.concat(entree, ingredients, sides, drinks);//everything we are checking for in input.

        queue_check.forEach(element => {
            if ( response.indexOf(element) == i ) {
                queue.push(element);
            }
        });
    }
    if ( queue.length == 0 ) {
        waitStaff("Sorry, I missed that.  Please enter what you would like to order.");
    }
    else {
        do_work(queue);
    }
}

function do_work(queue) {
    let action = 'add';
    let size = 'bigger';
    let last_step;
    while ( queue.length > 0 ) {
        let step = queue.shift();

        if ( action_items.includes(step) ) {
            switch ( step ) {
                case 'add':
                case 'with':
                case 'want':
                    action = 'add';
                    break;
                case 'no':
                case "don't":
                case 'remove':
                    action = 'remove';
                    break;
                case 'bigger':
                case 'big':
                    size = 'bigger';
                case 'smaller':
                case 'small':
                    size = 'smaller';
            }
            last_step = step;
        }

        if ( ingredients.includes(last_step) && (entree.includes(step) || sides.includes(step) || drinks.includes(step)) ) {
            action = 'add';
        }

        if ( action == 'add' ) {
            if ( entree.includes(step) ) {
                order.push(new OrderItem(step, size));
            }
            if ( ingredients.includes(step) ) {
                order[(order.length-1)].add_topping(step);
            }
            if ( sides.includes(step) ) {
                let side_added = false;
                order.forEach(item => {
                    if ( side_added == false && item.has_side() == false ) 
                    {
                        item.side = step;
                        side_added = true;
                    }
                });
            }
            if ( drinks.includes(step) ) {
                let drink_added = false;
                order.forEach(item => {
                    if ( drink_added == false && item.has_drink() == false ) 
                    {
                        item.drink = step;
                        drink_added = true;
                    }
                });
            }
            waitStaff("Does that recipe look good? or can I change anything for you?");
            last_step = step;
            displayOrder(order);
        } else if ( action == 'remove' ) {
            if ( entree.includes(step) ) {
                let index;
                order.forEach(item => {
                    if ( item.name == step ) {
                        index = order.indexOf(item);
                    }
                });
                order.splice(index, 1);
            }
            if ( ingredients.includes(step) ) {
                order[(order.length-1)].remove_topping(step);
            }
            if ( sides.includes(step) ) {
                let side_removed = false;
                order.forEach(item => {
                    if ( side_removed == false && item.has_side() == true ) 
                    {
                        item.side = 'none';
                        side_removed = true;
                    }
                });
            }
            if ( drinks.includes(step) ) {
                let drink_removed = false;
                order.forEach(item => {
                    if ( drink_removed == false && item.has_drink() == true ) 
                    {
                        item.drink = 'none';
                        drink_removed = true;
                    }
                });
            }
            waitStaff("That's been removed.  What else can I get you?");
            last_step = step;
            displayOrder(order);
        }
    }
}

function displayOrder(order) {
    let order_out = 'Your order:<br>';
    if ( order.length > 0 ) {
        let total = 0;
        order.forEach(item => {
            order_out += `$${item.price} ${item.name}: ${item.toppings}${item.has_side() ? ` with ${item.side}` : ``}${item.has_drink() ? ` and a ${item.drink}`:``}<br></br>`;
            total += parseInt(item.price);
        }); 
        order_out += `$${total.toFixed(2)} is your total`;
        orderScreen(order_out);
    } else {
        orderScreen('Order is currently empty.');
    }
}

function waitStaff(str) {
    document.getElementById('wait-staff').innerHTML = str;
}
function orderScreen(str) {
    document.getElementById('running-order').innerHTML = str;
}

class OrderItem {
    constructor(name, size = 'bigger') {
        this.name = name;
        this.size = size;
        this.side = 'none';
        this.drink = 'none';
        this.toppings = [...recipe[this.name]];
        if ( artisan.includes(this.name) ) {
            if ( this.size == 'bigger' ) {
                this.price = '8.00';
            } else {
                this.price = '6.00';
            }
        } else if ( this.size == 'bigger') {
                this.price = '7.50';
            } else {
                this.price = '5.00';
            }
    }
    remove_topping(topping) {
        if ( this.toppings.includes(topping) ) {
            this.toppings.splice(this.toppings.indexOf(topping), 1);
        }
    }
    add_topping(topping) {
        if ( !this.toppings.includes(topping) ) {
            this.toppings.push(topping);
        }
    }
    has_side() {
        if (this.side != 'none') {
            return true;
        }
        else {
            return false;
        }
    }
    has_drink() {
        if (this.drink != 'none') {
            return true;
        }
        else {
            return false;
        }
    }
}

const artisan = [
    'chicken pesto',
    'bacon cheeseburger',
    'sriracha chicken',
    'steak fajita',
    'boom boom black bean'
];
const classic = [
    'gyro',
    'souvlaki',
    'aloha',
    'awakin with bacon',
    'falafel'
];
const entree = artisan.concat(classic);
const ingredients = [
    'romaine',
    'spinach',
    'iceburg',
    'tomatoes',
    'cucumbers',
    'olives',
    'roasted red peppers',
    'onions',
    'pickles',
    'jalapenos',
    'banana peppers',
    'green peppers',
    'cilantro'
];
const chips = [
    'cool ranch doritos',
    'original lays',
    'salt and vinegar',
    'opium spice chilletos',
    'chester puffs crunch'
];
const cookie = [
    'macadamia nut',
    'chocolate chip'
];
const sides = chips.concat(cookie);
const drinks = [
    'fountain soda',
    'bottled juice',
    'bottled water'
];
const recipe = {
    'chicken pesto':['chicken breast grilled in pesto', 'romaine', 'roasted red peppers', 'tomatoes', 'onions', 'feta', 'greek seasoning'],
    'bacon cheeseburger':['steak', 'bacon', 'melted cheddar', 'iceberg lettuce', 'tomatoes', 'pickles', 'onions', 'yellow mustard', 'light mayo', 'smokehouse maple seasoning'],
    'sriracha chicken':['chicken grilled in sriracha', 'melted cheddar', 'iceberg lettuce', 'onions', 'tomatoes', 'jalapenos', 'banana peppers', 'honey mustard', 'bayou cajun seasoning'],
    'steak fajita':['steak', 'onions', 'green peppers', 'tomatoes', 'sour cream', 'roasted red peppers', 'iceberg lettuce', 'ancho chipotle sauce', 'pepper jack', 'mojito lime seasoning'],
    'boom boom black bean':['black bean patty', 'grilled onions', 'melted cheddar', 'romaine', 'tomatoes', 'cilantro', 'green peppers', 'boom boom sauce', 'mojito lime seasoning'],
    'gyro':['seasoned strips of lamb & beef', 'spinach', 'cucumbers', 'tomatoes', 'onions', 'black olives', 'feta', 'tzatziki'],
    'Souvlaki':['mediterranean seasoned dark meat chicken', 'spinach', 'tomatoes', 'onions', 'feta', 'cucumbers', 'black olives', 'tzatziki', 'greek seasoning'],
    'aloha':['chicken', 'ham & pineapple grilled in teriyaki', 'melted provolone', 'cucumbers', 'romaine', 'ranch dressing', 'mojito lime seasoning'],
    'awakin with bacon':['bacon', 'eggs', 'spinach', 'cheddar', 'green peppers', 'onions', 'ancho chipotle sauce', 'salt & pepper'],
    'falafel':['falafel balls grilled in secret sauce', 'spinach', 'tomatoes', 'onions', 'feta', 'cucumbers', 'black olives', 'tzatziki', 'greek seasoning'],

};
const action_items = [
    'add', 'with', 'no', "don't", 'remove', 'want', 'bigger', 'big', 'smaller', 'small'
];