import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getCategories, getTenants } from "../../http/api"
import { Category, Tenant } from "../../types"

type ProductFilterProps = {
    children?: React.ReactNode
    onFilterChange?: (filterName: string, filterValue: string) => void
}
const ProductFilter = ({ children }: ProductFilterProps) => {
    const { data: restaurants } = useQuery({
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`)
        },
        queryKey: ['restaurants'],

    })
    const { data: categories } = useQuery({
        queryFn: () => {
            return getCategories()
        },
        queryKey: ['categories'],

    })
    // console.log(categories);
    return (
        <Card >
            <Row >
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name={"q"}>
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"category"}>
                                <Select style={{ width: '100%' }} allowClear={true} placeholder="Select category">
                                    {
                                        categories?.data.map((category: Category) => (
                                            <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                                        ))
                                    }
                                    <Select.Option value="pizza">Pizza</Select.Option>
                                    <Select.Option value="beverages">Beverages</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"tenant"}>
                                <Select style={{ width: '100%' }} allowClear={true} placeholder="Select restaurant">
                                    {
                                        restaurants?.data?.data.map((restaurant: Tenant) => (
                                            <Select.Option key={restaurant.id} value={restaurant.id}>{restaurant.name}</Select.Option>
                                        ))
                                    }

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"isPublish"}>
                                <Space>
                                    <Switch defaultChecked />
                                    <Typography.Text>Show only published</Typography.Text>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>

        </Card>
    )
}

export default ProductFilter