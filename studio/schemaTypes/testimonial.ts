export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g., Bride, Cafe Owner, Student',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'image',
      title: 'Client Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      name: 'videoFile',
      title: 'Video Testimonial',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      description: 'Upload video file directly (MP4, WebM). Max 50MB recommended.',
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Video Caption',
          description: 'Optional caption for the video'
        }
      ]
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5],
        layout: 'radio'
      },
      initialValue: 5
    },
    {
      name: 'theme',
      title: 'Theme Category',
      type: 'string',
      options: {
        list: [
          { title: 'Beautician', value: 'beautician' },
          { title: 'Barista', value: 'barista' },
          { title: 'Neutral', value: 'neutral' }
        ]
      },
      initialValue: 'neutral'
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this testimonial first'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
      hasVideo: 'videoFile'
    },
    prepare({ title, subtitle, media, hasVideo }: any) {
      return {
        title,
        subtitle: hasVideo ? `🎬 ${subtitle} (Video)` : subtitle,
        media: media
      };
    }
  }
}