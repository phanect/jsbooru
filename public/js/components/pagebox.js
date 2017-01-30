"use strict";

Vue.component("page-box", {
    template: "#pagebox-template",
    props: {
        start: {
            default: 0,
            type: Number,
        },
        pageCount: {
            default: 20,
            type: Number,
        },
        count: {
            default: 0,
            type: Number,
        },
        currTags: String,
    },
    computed: {
        pages: function() {
            var arrayCount = Math.ceil(this.count / this.pageCount);
            var array = [];
            var curr = 0;
            while(curr < arrayCount){
                var value = curr*this.pageCount;
                array.push({
                    identifier: curr+1,
                    value: value,
                    selected: (this.start <= value && value < this.start + this.pageCount) 
                });
                curr++;
            }
            return array;
        },
    }
});