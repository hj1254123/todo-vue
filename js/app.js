;(function(){
    Vue.directive('focus', {
        inserted: function(el) {
            el.focus()
        }
    })

    Vue.directive('todo-focus', {
        update (el, binding) {
            if (binding.value) {
                el.focus()
            }
        }
    })

    window.vm = new Vue({
        el: '#app',
        data: {
            todos: JSON.parse(localStorage.todos || '[]'),
            currentEditing: null,
            filterText: '#/'
        },
        computed: {
            // 获取未完成任务个数
            NumberOfOutStandingTasks: function() {
                // console.log('计算属性')
                var a = this.todos.filter(function(i) {
                    return i.completed === false
                }).length
                return a
            },
            // 全选与全不选按钮功能
            allOrNone: {
                get: function() {
                    // console.log('allornone')
                    var a = this.todos.every(function(i) {
                        return i.completed === true
                    })
                    return a
                },
                set: function() {
                    var checked = !this.allOrNone
                    // console.log('修改', checked)
                    this.todos.forEach(function(value) {
                        value.completed = checked
                    })
                }
            },
            filterTodos: function() {
                console.log('iii')
                // 如果为all返回全部任务
                if (this.filterText === '#/active') {
                    var a = this.todos.filter(function(i) {
                        return i.completed === false
                    })
                    return a
                } else if (this.filterText === '#/completed') {
                    var a = this.todos.filter(function(i) {
                        return i.completed === true
                    })
                    return a
                } else {
                    return this.todos
                }
            }
        },
        watch: {
            todos: {
                handler: function() {
                    // console.log('todos变了', this.todos);
                    var s = JSON.stringify(this.todos)
                    localStorage.todos = s
                },
                deep: true //为true表示深沉监视
            }
        },
        methods: {
            // 回车添加任务
            enterAddTodo: function(event) {
                var target = event.target
                var value = target.value.trim()
                console.log(value)
                if (value === '') {
                    return
                }
                // 获取todos数组
                var todos = this.todos
                if (todos.length === 0) {
                    var todoId = 1
                } else {
                    var todoId = todos[todos.length - 1].id + 1
                }
                // console.log('新todoid', todoId)
                // 得到新的todo项数据
                var l = {
                    id: todoId,
                    title: value,
                    completed: false
                }
                // 添加到todos中
                todos.push(l)
                target.value = ''
            },
            // 删除todo任务
            deleteTodoTask: function(index) {
                this.todos.splice(index, 1)
            },
    		// 双击编辑
            dblclickEditing: function(item) {

                this.currentEditing = item.id
            },
    		// 编辑时回车修改任务
    		editEntUpTodoTask: function(event, index) {
    			// 获取到文本框的值
    			var value = event.target.value
    			// console.log('!', value, index)
    			// 如果为空直接删除任务
    			if (value.trim() === '') {
    				this.todos.splice(index, 1)
    				this.currentEditing = null
    				return
    			}
    			// 修改到todos列表
    			this.todos[index].title = value.trim()
    			this.currentEditing = null
    		},
    		// 点击删除已完成任务
    		clickDeleteToComplete: function() {
    			for (var i = 0; i < this.todos.length; i++) {
    			// 获取到已完成的任务下标completed=true表示已完成
    				var t = this.todos
    				if (t[i].completed) {
    					console.log('度')
    					t.splice(i, 1)
    					i--
    				}
    			}
    		},

        }
    })
    
    // 让当前url值赋值给filterText,这样数据改变就会调用上面的计算函数
    var handlehashchange = function() {
        vm.filterText = location.hash
    }
    // 第一次进入页面需要调用一次,以保持状态
    handlehashchange()
    // 这里赋值给onhashchange事件,当url改变时,自动调用handlehashchange函数
    window.onhashchange = handlehashchange
})()
