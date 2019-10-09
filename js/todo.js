var MYAPP = {};

      MYAPP.commonMethod = {
        addTodo: function ()
        {
          var task, obj, todos, hasAttribute, index;
          task = document.getElementById('task').value.trim();
          dataId = document.getElementById('add-todo');
          if(task && task !== '' && dataId.hasAttribute('data-id'))
          {
            // update
            index = dataId.getAttribute('data-id');
            MYAPP.commonMethod.todoInsertUpdate(task, +index);
          } else if(task && task !== '') {
            // Insert
            MYAPP.commonMethod.todoInsertUpdate(task);
          } else
          {
            document.getElementById('error-list').style.display = 'block';
          }
          
        },
        getTodos: function() {
          var todos, todos_str;
          todos = new Array;
          todos_str = localStorage.getItem('todo');

          if(todos_str != null)
          {
            todos = JSON.parse(todos_str);
          }

          return todos;

        },
        showTodos: function() {
          var todos, html_content, i, className, taskStatus, buttons, j, checked_status;
          todos = MYAPP.commonMethod.getTodos();
          html_content = '';
          if(typeof todos === 'object' && todos.length > 0)
          {
            html_content += '<ul class="list-group">';
            for(i = 0; i < todos.length; i++)
            {
              className = 'secondary';
              taskStatus = 'Pending';
              textDecoration = 'none';
              checked_status = 'unchecked';
              if(todos[i].status === 'completed')
              {
                className = 'success';
                taskStatus = 'Done';
                textDecoration = 'line-through';
                checked_status = 'checked';
              }

              html_content += '<li class="list-group-item d-flex justify-content-between align-items-center">';
                html_content += '<div class="form-check">';
                  html_content += '<input type="checkbox" name="todo-' + i + '" id="todo-' + i + '" class="todo-lists form-check-input position-static" value="'+ i +'" ' + checked_status + ' />';
                  html_content += ' <label for="todo-' + i + '"><span style="text-decoration:' + textDecoration + '">' + todos[i].task + '</span></label>';
                  html_content += ' <span class="badge badge-'+ className +'">' + taskStatus + '</span>';
                html_content += '</div>';
                html_content += '<div class="pull-right">';
                  html_content += ' <button class="btn btn-primary btn-sm edit" id="edit-'+ i +'">';
                  html_content += '<i class="fa fa-edit"></i>';
                  html_content += '</button>';
                  html_content += ' <button class="btn btn-danger btn-sm remove" id="delete-'+ i +'">';
                  html_content += '<i class="fa fa-trash-alt"></i>';
                  html_content += '</button>';
                html_content += '</div>';
              html_content += '</li>';
            }

            document.getElementById('todos').innerHTML = html_content;

            remove_buttons = document.getElementsByClassName('remove');
            edit_buttons = document.getElementsByClassName('edit');
            checkbox_button = document.getElementsByClassName('todo-lists');
            if(remove_buttons && remove_buttons.length > 0)
            {
              for(j = 0; j < remove_buttons.length; j++)
              {
                remove_buttons[j].addEventListener('click', MYAPP.commonMethod.removeTodo);
                edit_buttons[j].addEventListener('click', MYAPP.commonMethod.editTodo);
                checkbox_button[j].addEventListener('click', MYAPP.commonMethod.changeTodoStatus);
              }
            }
          }else
          {
            html_content = '<div class="form-text"><p class="text-warning">Empty todo lists! Please add new task.</p></div>';
            document.getElementById('todos').innerHTML = html_content;
          }
        },
        removeTodo: function() {
          var id, todos;
          id = this.getAttribute('id');
          obj = id.split('-');
          todos = MYAPP.commonMethod.getTodos();
          if(todos.length > 0 && +obj[1] > -1)
          {
            todos.splice(+obj[1], 1);
          }
          localStorage.setItem('todo', JSON.stringify(todos));
          MYAPP.commonMethod.showTodos();
        },
        editTodo: function(index) {
          var id, obj, task;
          id = this.getAttribute('id');
          if(id)
          {
            obj = id.split('-');
            todo = MYAPP.commonMethod.getTodos()[+obj[1]];
            if(todo)
            {
              task = todo.task;
              document.getElementById('task').value = task;
              document.getElementById('add-todo').value = 'Update Todo';
              document.getElementById('switch-todo-btn').style.display = 'inline-block';
              document.getElementsByTagName('input')[1].setAttribute('data-id', +obj[1]);
            }
          }
        },
        todoInsertUpdate(task, index)
        {
          todos = MYAPP.commonMethod.getTodos();
          if(index > -1)
          {
            // update record
            todos[index].task = task;
          }else {
            // Insert record
            obj = { task: task, status: 'pending', created_on: new Date() }
            todos.push(obj);
          }
          
          localStorage.setItem('todo', JSON.stringify(todos));
          document.getElementById('error-list').style.display = 'none';
          document.getElementById('todo-form').reset();
          MYAPP.commonMethod.showTodos();
        },
        changeTodoStatus: function()
        {
          var todos, status, i, index, temp_array;
          todos = MYAPP.commonMethod.getTodos();
          console.log('Before', todos);
          status = 'pending';
          index = +this.value;
          if(this.checked === true)
          {
            status = 'completed';
          }
          todos[index].status = status;
          localStorage.setItem('todo', JSON.stringify(todos));
          MYAPP.commonMethod.showTodos();
        },
        switchTodo: function()
        {
          document.getElementById('todo-form').reset();
          document.getElementById('add-todo').removeAttribute('data-id');
          document.getElementById('add-todo').value = 'Add Todo';
          document.getElementById('switch-todo-btn').style.display = 'none';
        }
      };

      document.getElementById('add-todo').addEventListener('click', MYAPP.commonMethod.addTodo);
      MYAPP.commonMethod.showTodos();
      document.getElementById('switch-todo-btn').addEventListener('click', MYAPP.commonMethod.switchTodo);