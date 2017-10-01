import S3 from 'aws-sdk/clients/s3';


const AWS_S3_UPLOAD_BUCKET = process.env.AWS_S3_UPLOAD_BUCKET;

const s3 = new S3({
	accessKeyId: process.env.AWS_S3_USER_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_S3_USER_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION
});

const s3Admin = new S3({
	accessKeyId: process.env.AWS_S3_ADMIN_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_S3_ADMIN_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION
});


export {
	s3,
	s3Admin,
	AWS_S3_UPLOAD_BUCKET
}
