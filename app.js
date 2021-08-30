const Note = {
   // TODO:61 
}

const Notes = {
    template: `
        <div>
            <a>Add Note</a>
        </div>
    `
}



const app = new Vue({
    el: '#app',
    components: {
        'notes': Notes
    },
    template: `
        <notes></notes>
    `
})