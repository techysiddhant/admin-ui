import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../../../types";

const TenantForm = () => {
    const {
        data: tenants
    } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            return getTenants().then((res) => res.data);
        },
        // placeholderData: keepPreviousData,
    });
    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size={20}>
                    <Card title="Basic info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label="First name" name={'firstName'} rules={[
                                    {
                                        required: true,
                                        message: 'First name is required'
                                    }
                                ]}>

                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Last name" name={'lastName'} rules={[
                                    {
                                        required: true,
                                        message: 'Last name is required'
                                    }
                                ]}>

                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Email" name={'email'} rules={[
                                    {
                                        required: true,
                                        message: 'Email name is required'
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email is not valid'
                                    }
                                ]}>

                                    <Input type="email" size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Security info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label="Password" name={'password'} rules={[
                                    {
                                        required: true,
                                        message: 'Password is required'
                                    }
                                ]}>
                                    <Input.Password size="large" type="password" />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>
                    <Card title="Role info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label="Select Role" name={'role'} rules={[
                                    {
                                        required: true,
                                        message: 'Role is required'
                                    }
                                ]}>
                                    <Select style={{ width: '100%' }} onChange={() => { }} allowClear={true} placeholder="Select Role">
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="manager">Manager</Select.Option>
                                        <Select.Option value="customer">Customer</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Select Tenant" name={'tenantId'} rules={[
                                    {
                                        required: true,
                                        message: 'Resturant is required'
                                    }
                                ]}>
                                    <Select style={{ width: '100%' }} onChange={() => { }} allowClear={true} placeholder="Select Restaurants">
                                        {
                                            tenants &&
                                            tenants?.data?.map((tenant: Tenant) => (
                                                <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>

                                            ))
                                        }

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}

export default TenantForm