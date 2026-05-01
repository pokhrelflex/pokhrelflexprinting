const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'pfp-images';
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const BUCKET_OPTIONS = {
  public: true,
  fileSizeLimit: MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
};

let supabase = null;
let bucketReady = false;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('✅ Supabase Storage client initialized');
} else {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_KEY not set — image uploads will be disabled.');
}

async function uploadImage(fileBuffer, originalName) {
  if (!supabase) throw new Error('Supabase Storage is not configured');
  const ext = path.extname(originalName).toLowerCase();
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = `products/${uniqueName}`;

  await ensureBucketReady();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: getMimeType(ext),
      upsert: false,
    });

  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

async function ensureBucketReady() {
  if (bucketReady) return;
  const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(BUCKET);
  if (!getBucketError && bucket) {
    bucketReady = true;
    return;
  }
  const { error: createBucketError } = await supabase.storage.createBucket(BUCKET, BUCKET_OPTIONS);
  if (createBucketError) throw createBucketError;
  bucketReady = true;
}

async function deleteImage(publicUrl) {
  if (!supabase || !publicUrl) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const filePath = publicUrl.substring(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([filePath]);
}

function getMimeType(ext) {
  const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.pdf': 'application/pdf' };
  return types[ext] || 'image/jpeg';
}

module.exports = { uploadImage, deleteImage, BUCKET };
