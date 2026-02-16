export default {
  name: 'demoVideo',
  title: 'Demo Videos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what this video demonstrates'
    },
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      description: 'Upload MP4 or WebM file (max 50MB recommended)',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Static image shown before video plays. If empty, uses a placeholder.',
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'For accessibility'
        }
      ]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
          list: [
          { title: 'Product', value: 'product' },
          { title: 'Technique', value: 'technique' },
          { title: 'Theory', value: 'theory' },
          { title: 'Equipment', value: 'equipment' },
          { title: 'Latte Art', value: 'latte-art' }
        ]
      }
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'thumbnail'
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title,
        subtitle: subtitle ? `🎬 ${subtitle}` : '🎬 Video',
        media: media
      };
    }
  }
}