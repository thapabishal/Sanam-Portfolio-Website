export default {
  name: 'trainingModule',
  title: 'Training Module',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }},
    {
      name: 'level',
      title: 'Level',
      type: 'string',
      options: { list: ['beginner', 'intermediate', 'advanced', 'all'] },
      validation: (Rule: any) => Rule.required()
    },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'shortDescription', title: 'Short Description', type: 'text' },
    { name: 'fullDescription', title: 'Full Description', type: 'array', of: [{ type: 'block' }] },
    { name: 'icon', title: 'Icon', type: 'image', options: { hotspot: true }},
    {
      name: 'duration',
      title: 'Duration',
      type: 'object',
      fields: [
        { name: 'hours', title: 'Hours', type: 'number' },
        { name: 'displayText', title: 'Display Text', type: 'string' }
      ]
    },
    {
      name: 'learningOutcomes',
      title: 'Learning Outcomes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'outcome', title: 'Outcome', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' }
        ]
      }]
    },
    {
      name: 'certification',
      title: 'Certification Available',
      type: 'boolean',
      initialValue: false
    },
    { name: 'available', title: 'Available', type: 'boolean', initialValue: true },
    { name: 'order', title: 'Order', type: 'number', initialValue: 0 },
  ]
}