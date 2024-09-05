import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography, Upload } from "antd"
import { getCategories, getTenants } from "../../../http/api"
import { Category, Tenant } from "../../../types"
import { PlusOutlined } from '@ant-design/icons';
import Pricing from "./Pricing";
import Attributes from "./Attributes";
const ProductForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
    const selectedCategory = Form.useWatch('categoryId');
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
                                        <Upload maxCount={1} accept="image/*" listType="picture-card" >
                                            <Space direction="vertical">
                                                <PlusOutlined />
                                                <Typography.Text>Upload</Typography.Text>
                                            </Space>
                                        </Upload>

                                    </Form.Item>
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
                            <Attributes />
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