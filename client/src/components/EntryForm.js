import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const EntryForm = ({ onSubmit, initialData = {}, editMode = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category?._id || '');
  const [subcategories, setSubcategories] = useState(initialData.subcategories || []);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data);
    };
    fetchCategories();
  }, [user.token]);

  const handleSubcategoryChange = (index, field, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index][field] = value;
    setSubcategories(newSubcategories);
  };

  const addSubcategory = () => {
    setSubcategories([...subcategories, { name: '', value: '', linkedEntry: '' }]);
  };

  const removeSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode
        ? `${process.env.REACT_APP_API_URL}/entries/${initialData._id}`
        : `${process.env.REACT_APP_API_URL}/entries`;
      const method = editMode ? 'put' : 'post';
      const res = await axios[method](
        url,
        { title, content, category, subcategories },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onSubmit(res.data);
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${editMode ? 'update' : 'create'} entry`);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <ReactQuill value={content} onChange={setContent} style={{ height: '200px', marginBottom: '50px' }} />
        {subcategories.map((sub, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <TextField
              label="Subcategory Name"
              value={sub.name}
              onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
            />
            <TextField
              label="Subcategory Value"
              value={sub.value}
              onChange={(e) => handleSubcategoryChange(index, 'value', e.target.value)}
            />
            <TextField
              label="Linked Entry ID (optional)"
              value={sub.linkedEntry}
              onChange={(e) => handleSubcategoryChange(index, 'linkedEntry', e.target.value)}
            />
            <Button onClick={() => removeSubcategory(index)} variant="outlined" color="secondary">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addSubcategory} variant="outlined" color="primary" style={{ marginBottom: '20px' }}>
          Add Subcategory
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {editMode ? 'Update' : 'Create'} Entry
        </Button>
      </form>
    </Container>
  );
};

export default EntryForm;
