import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getCategories, getTenants } from "../../../http/api"
import { Category, Tenant } from "../../../types"
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
const ProductForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
    const selectedCategory = Form.useWatch('categoryId');
    // const [messageApi, contextHolder] = message.useMessage();
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { data: categories } = useQuery({
        queryFn: () => {
            return getCategories()
        },
        queryKey: ['categories'],
    })
    const { data: restaurants } = useQuery({
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`)
        },
        queryKey: ['restaurants'],

    })
    // const uploaderConfig: UploadProps = {
    //     name: 'file',
    //     multiple: false,
    //     showUploadList: false,
    //     beforeUpload: (file) => {
    //         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    //         if (!isJpgOrPng) {
    //             messageApi.error('You can only upload JPG/PNG file!');
    //         }
    //         //TODO: size validation
    //         setImageUrl(URL.createObjectURL(file))
    //         return false
    //     }
    // }
    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="large">
                    <Card title="Basic info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name={"categoryId"} label="Select Category" rules={[
                                    {
                                        required: true,
                                        message: 'Category is required',
                                    },
                                ]}>
                                    <Select size="large" style={{ width: '100%' }} allowClear={true} placeholder="Select category">
                                        {
                                            categories?.data.map((category: Category) => (
                                                <Select.Option key={category._id} value={JSON.stringify(category)}>{category.name}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Description is required',
                                        },
                                    ]}>
                                    <Input.TextArea rows={2} maxLength={100} size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    {!isEditMode && (
                        <Card title="Product Image" bordered={false}>
                            <Row gutter={20}>
                                <Col span={12}>
                                    <ProductImage />
                                </Col>
                            </Row>
                        </Card>
                    )}

                    <Card title="Tenant info" bordered={false}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="Select Tenant"
                                    name="tenantId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tenant is required',
                                        },
                                    ]}>
                                    <Select
                                        id="selectBoxInUserForm"
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => { }}
                                        placeholder="Select Tenant">
                                        {
                                            restaurants?.data?.data.map((restaurant: Tenant) => (
                                                <Select.Option key={restaurant.id} value={restaurant.id}>{restaurant.name}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>
                    {
                        selectedCategory && (
                            <Pricing selectedCategory={selectedCategory} />
                        )
                    }
                    {
                        selectedCategory && (
                            <Attributes selectedCategory={selectedCategory} />
                        )
                    }
                    <Card title="Other properties" bordered={false}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Space>
                                    <Form.Item
                                        name="isPublish"
                                    >
                                        <Switch defaultChecked={false} checkedChildren="Yes" unCheckedChildren="No" onChange={() => { }} />
                                    </Form.Item>
                                    <Typography.Text style={{ marginBottom: 20, display: "block" }}>Published</Typography.Text>

                                </Space>

                            </Col>

                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default ProductForm