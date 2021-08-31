const Editor = {
    props: [
        'entityObject'
    ],
    data() {
        return {
            entity: this.entityObject
        }
    },

    methods: {
        // update() {
        //     // this.$emit('update');
        //     loadCollection('notes')
        //     .then(collection => {
        //         collection.update(this.entity);
        //         db.saveDatabase();
        //     })
        // },
    },
    template: 
        `<div class="ui form">
            <div class="field">
                <textarea
                    rows="5"
                    placeholder="write something..."
                    v-model="entity.body"></textarea>
            </div>

        </div>
        `
}

const Note = {
    props: [
        'entityObject'
    ],

    data() {
        return {
            entity: this.entityObject,
            open: false,
        };
    },
    computed: {
        header() {
            return _.truncate(this.entity.body, {length: 30});
        },
        updated() {
            return moment(this.entity.meta.updated).fromNow();
        },
        words() {
            return this.entity.body.trim().length;
        },
    },
    components: {
        'editor': Editor
    },
    methods: {
        save() {
            //console.log(this.entity);
            loadCollection('notes')
            .then(collection => {
                collection.update(this.entity);
                db.saveDatabase();
            })
        },
        destroy(id) {
             this.$emit('destroy', id);
        },
    },
    template:  
     `
     <div class="item">
        <div class="meta">
            {{updated}}
        </div>
       <div class="content" >
           <div class="header" @click.stop="open = !open">
                {{ header || 'New note' }}
           </div>
           <div class="extra">
                <editor
                :entityObject="entity"
                v-if="open"
                @update="save"></editor>
                {{ words }} words
                <i class="right floated trash alternate outline icon"
                @click="destroy(entity.$loki)"></i>
                <i class="right floated save outline icon" v-if="open"
                @click="save"> </i>
           </div>
       </div>
    </div>
    `
}


const Notes = {
    data() {
        return {
            entities: []
        }
    },
    created() {
        loadCollection('notes')
        .then(collection => {
            //console.log(collection);
            const _entities = collection.chain().find().data();
            this.entities = _entities.reverse();
            console.log(this.entities);


        })
    },
    methods: {
        create() {
            loadCollection('notes')
            .then(collection => {
                const entity = collection.insert({
                    body: 'New note'
                });
                db.saveDatabase();
                this.entities.unshift(entity);
            })
        },
        destroy(id) {
            const _entities = this.entities.filter(entity => {
                return entity.$loki !== id;
            });
            this.entities = _entities;
            //console.log(id);
            loadCollection('notes')
            .then(collection => {
               collection.remove({'$loki': id});
               db.saveDatabase();
            })
        },
    },

    components: {
        'note': Note
    },
    template: `
        <div class="ui container notes">
            <h4 class="ui horizontal divider header">
                <i class="paw icon">
                </i>
                Notebook
            </h4>

            <a class="ui right floated basic violet button"
            @click="create">Add Note</a>
            
            <div class="ui divided items">
                <note 
                v-for="entity in entities"
                :entityObject="entity"
                :key="entity.$loki"
                @destroy="destroy">
                </note>
            </div>
           
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