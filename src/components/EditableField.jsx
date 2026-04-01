const EditableField = ({ value, type = 'text', className = '' }) => {
  if (type === 'image') return <img src={value} alt="" className={className} />;
  if (type === 'textarea') return <p className={className} dangerouslySetInnerHTML={{ __html: value?.replace(/\n/g, '<br/>') || '' }} />;
  return <span className={className}>{value}</span>;
};

export default EditableField;
