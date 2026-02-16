export default {
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bridal', value: 'bridal' },
          { title: 'Editorial', value: 'editorial' },
          { title: 'SFX', value: 'sfx' },
          { title: 'Glam', value: 'glam' },
          { title: 'Avant Garde', value: 'avantgarde' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
    },
    {
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
      validation: (Rule: any) => Rule.required(),
    },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'duration', title: 'Duration', type: 'string' },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'publishedAt', title: 'Published At', type: 'datetime', initialValue: (new Date()).toISOString() },
  ],
  preview: {
    select: { title: 'title', media: 'afterImage', category: 'category' },
    prepare: ({ title, media, category }: any) => ({ title, subtitle: category, media })
  }
}