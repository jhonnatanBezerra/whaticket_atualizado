import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem'
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '1rem'
  },
  input: {
    flexGrow: 1,
    marginRight: '1rem'
  },
  listContainer: {
    width: '100%',
    height: '100%',
    marginTop: '1rem',
    backgroundColor: '#fffff',
    borderRadius: '5px',
  },
  list: {
    marginBottom: '5px',
    borderRadius: '5px',
  },
  stopped: {
    backgroundColor: '#1E90FF',
  },
  inProgress: {
    backgroundColor: '#FFA500',
  },
  resolved: {
    backgroundColor: '#00FF00',
  }
});

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Parado');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [openAlert, setOpenAlert] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      setOpenAlert(true);
      return;
    }

    const now = new Date();
    const companyId = localStorage.getItem('companyId');
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      const filteredTasks = filterTasksByCompanyId(newTasks); // Filtrar as tarefas pela empresa atual
      newTasks[newTasks.indexOf(filteredTasks[editIndex])] = { text: task, status: status, updatedAt: now, createdAt: newTasks[newTasks.indexOf(filteredTasks[editIndex])].createdAt, companyId };
      setTasks(newTasks);
      setTask('');
      setStatus('Parado');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, status: status, createdAt: now, updatedAt: now, companyId }]);
      setTask('');
      setStatus('Parado');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setStatus(tasks[index].status);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    const filteredTasks = filterTasksByCompanyId(newTasks); // Filtrar as tarefas pela empresa atual
    newTasks.splice(newTasks.indexOf(filteredTasks[index]), 1);
    setTasks(newTasks);
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const filterTasksByCompanyId = (tasks) => {
    const companyId = localStorage.getItem('companyId');
    return tasks.filter(task => {
      return task.companyId === companyId && (filterStatus === 'Todos' || task.status === filterStatus);
    });
  };

  const filteredTasks = filterTasksByCompanyId(tasks);

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label="Nova tarefa"
          value={task}
          onChange={handleTaskChange}
          variant="outlined"
          inputProps={{ maxLength: 150 }}
        />
        <Select
          value={status}
          onChange={handleStatusChange}
          variant="outlined"
          style={{ minWidth: 120, marginRight: '1rem' }}
        >
          <MenuItem value="Parado">Parado</MenuItem>
          <MenuItem value="Em Andamento">Em Andamento</MenuItem>
          <MenuItem value="Resolvido">Resolvido</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
      <div className={classes.inputContainer}>
        <Select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          variant="outlined"
          style={{ minWidth: 120, marginRight: '1rem' }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Parado">Parado</MenuItem>
          <MenuItem value="Em Andamento">Em Andamento</MenuItem>
          <MenuItem value="Resolvido">Resolvido</MenuItem>
        </Select>
      </div>
      <div className={classes.listContainer}>
        <List>
          {filteredTasks.map((task, index) => (
            <ListItem key={index} className={`${classes.list} ${task.status === 'Parado' ? classes.stopped : task.status === 'Em Andamento' ? classes.inProgress : classes.resolved}`}>
            <ListItemText 
              primary={task.text} 
              secondary={`${task.status} - ${task.updatedAt.toLocaleString()}`} // Adicionando o status aqui
            />
            <ListItemSecondaryAction>
              {/* <IconButton onClick={() => handleEditTask(index)}>
                <EditIcon />
              </IconButton> */}
              <IconButton onClick={() => handleDeleteTask(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>          
          ))}
        </List>
      </div>
      <Dialog open={openAlert} onClose={handleAlertClose}>
        <DialogTitle>Erro</DialogTitle>
        <DialogContent>
          Não é possível adicionar uma tarefa sem texto.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ToDoList;