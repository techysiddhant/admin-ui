import { Form, Typography, Upload, Space, UploadProps, message } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import { useState } from "react";

const ProductImage = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const uploaderConfig: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            if (!isJpgOrPng) {
                messageApi.error('You can only upload JPG/PNG file!');
            }
            //TODO: size validation
            setImageUrl(URL.createObjectURL(file))
            return false
        }
    }
    return (
        <Form.Item
            label="Product image"
            name="image"
            rules={[
                {
                    required: true,
                    message: 'Product image is required',
                },
            ]}
        >
            <Upload accept="image/*" maxCount={1} listType="picture-card" {...uploaderConfig} >
                {contextHolder}
                {
                    imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <Space direction="vertical">
                        <PlusOutlined />
                        <Typography.Text>Upload</Typography.Text>
                    </Space>
                }

            </Upload>

        </Form.Item>
    )
}

export default ProductImage