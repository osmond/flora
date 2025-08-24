import cloudinary from '@/lib/cloudinary';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('id, public_id')
      .eq('id', id)
      .single();
    if (error || !data) {
      return new Response('Not found', { status: 404 });
    }

    if (data.public_id) {
      await cloudinary.uploader.destroy(data.public_id);
    }

    const { error: delError } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);
    if (delError) {
      return new Response('Database error', { status: 500 });
    }
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response('Server error', { status: 500 });
  }
}
