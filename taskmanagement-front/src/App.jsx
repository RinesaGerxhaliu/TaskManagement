import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import TaskList from "./Features/TaskList";
import TaskForm from "./Features/TaskForm";
import { createTask } from "./Features/metaService";
import EditTask from './Features/EditTasks';

function App() {
  const handleCreateTask = async (task) => {
    try {
      await createTask(task);
      alert("Task created successfully");
      // mund të navigosh tek lista e detyrave pas krijimit
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route
            path="/add"
            element={<TaskForm onSubmit={handleCreateTask} />}
          />
          {/* Rrugë të tjera si edit, category, etj mund të shtohen këtu */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
