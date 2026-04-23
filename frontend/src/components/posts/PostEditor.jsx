import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

// Single form component used for both create and edit
export default function PostEditor({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags?.join(', '),
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  const fieldStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    background: 'var(--color-inset)',
    border: `1px solid ${errors.content ? 'var(--color-danger)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '250px',
    resize: 'vertical',
    marginBottom: errors.content ? '0' : '1rem',
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Title *"
        placeholder="Post title..."
        error={errors.title?.message}
        {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
      />
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Content *</label>
        <textarea style={fieldStyle} placeholder="Write your post content..." {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Min 10 characters' } })} />
        {errors.content && <p style={{ color: 'var(--color-danger)', margin: '0.25rem 0 1rem', fontSize: '0.82rem' }}>{errors.content.message}</p>}
      </div>
      <Input
        label="Tags (comma separated)"
        placeholder="react, javascript, tutorial"
        {...register('tags')}
      />
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Status</label>
        <select
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            background: 'var(--color-inset)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
          }}
          {...register('status')}
          defaultValue="draft"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}</Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
