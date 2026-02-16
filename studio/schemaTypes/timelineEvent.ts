export default {
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'year', title: 'Year', type: 'number', validation: (Rule: any) => Rule.required().min(1900).max(2100) },
    { name: 'month', title: 'Month', type: 'string', options: { list: [
      {title: 'Jan', value: '01'}, {title: 'Feb', value: '02'}, {title: 'Mar', value: '03'},
      {title: 'Apr', value: '04'}, {title: 'May', value: '05'}, {title: 'Jun', value: '06'},
      {title: 'Jul', value: '07'}, {title: 'Aug', value: '08'}, {title: 'Sep', value: '09'},
      {title: 'Oct', value: '10'}, {title: 'Nov', value: '11'}, {title: 'Dec', value: '12'}
    ]}},
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required() },
    { name: 'fullStory', title: 'Full Story', type: 'array', of: [{ type: 'block' }] },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }] },
    { name: 'relatedTo', title: 'Related To', type: 'string', options: { list: ['beautician', 'training', 'both', 'general'] }, initialValue: 'both' },
    { name: 'icon', title: 'Icon (Emoji)', type: 'string', initialValue: '📅' },
    { name: 'link', title: 'External Link', type: 'object', fields: [{ name: 'url', type: 'url', title: 'URL' }, { name: 'text', type: 'string', title: 'Link Text' }] },
    { name: 'metrics', title: 'Metrics', type: 'object', fields: [{ name: 'number', type: 'string' }, { name: 'label', type: 'string' }] },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'visible', title: 'Visible', type: 'boolean', initialValue: true },
  ]
}