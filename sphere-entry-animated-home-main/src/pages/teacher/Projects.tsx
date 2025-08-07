import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    dueDate: '',
    description: '',
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/AddProject');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast.error('Failed to fetch projects.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Submit or Update Project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.class || !formData.subject || !formData.dueDate || !formData.description) {
      toast.warning('Please fill all fields before submitting.');
      return;
    }

    const newData = {
      ...formData,
      submissions: formData.submissions || 0,
      totalStudents: formData.totalStudents || 30,
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/AddProject/${editingId}`, newData);
        toast.success('Project updated successfully!');
      } else {
        await axios.post('http://localhost:5000/AddProject', newData);
        toast.success('Project assigned successfully!');
      }

      fetchProjects();
      setFormData({ title: '', class: '', subject: '', dueDate: '', description: '' });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit project.');
    }
  };

  // Edit Project
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      class: project.class,
      subject: project.subject,
      dueDate: project.dueDate,
      description: project.description,
    });
    setEditingId(project._id);
    setShowAddForm(true);
  };

  // Delete Project
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/AddProject/${id}`);
      toast.info('Project deleted successfully.');
      fetchProjects();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete project.');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-50 to-rose-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate('/dashboard/teacher')}
              variant="outline"
              size="sm"
              className="flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Project Management</h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-pink-600 hover:bg-pink-700 flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Assign Project
          </Button>
        </div>

        {/* Project Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Project' : 'Assign New Project'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Class</label>
                    <Input
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      placeholder="Enter class"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description & Instructions</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description and instructions..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base"
                  >
                    {editingId ? 'Update Project' : 'Assign Project'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ title: '', class: '', subject: '', dueDate: '', description: '' });
                    }}
                    className="flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Project Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[640px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.class}</TableCell>
                        <TableCell>{project.subject}</TableCell>
                        <TableCell>{project.dueDate}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {project.submissions}/{project.totalStudents}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(project._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No projects assigned yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
