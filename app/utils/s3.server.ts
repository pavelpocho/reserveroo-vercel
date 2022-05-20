import { S3 } from "aws-sdk"
import { InternalSymbolName } from "typescript";
import { s3 } from "~/db.server"

export const uploadImageToS3 = async (image: Buffer, fileName: string) => {
  const params: S3.PutObjectRequest = {
    Bucket: 'reserveroobucket',
    Body: image,
    Key: fileName
  };

  return (await s3.upload(params).promise()).Location;
}

export const getImageFromS3 = async (url: string) => {
  const params: S3.GetObjectRequest = {
    Bucket: 'reserveroobucket',
    Key: 'mytestimage.png'
  };

  return (await s3.getObject(params).promise());
}

export const deleteImageFromS3 = async (key: string) => {
  const params: S3.DeleteObjectRequest = {
    Bucket: 'reserveroobucket',
    Key: key
  };

  return (await s3.deleteObject(params).promise());
}