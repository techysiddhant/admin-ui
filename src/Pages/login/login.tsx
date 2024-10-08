import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd"
import { LockFilled, UserOutlined, LockOutlined } from '@ant-design/icons'
import Logo from "../../components/icons/Logo"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Credentials } from "../../types"
import { login, logout, self } from "../../http/api"
import { useAuthStore } from "../../store"
import { usePermission } from "../../hooks/usePermission"
const loginUser = async (credentials: Credentials) => {
    //TODO: server call logic
    const { data } = await login(credentials);
    return data;
}
const getSelf = async () => {
    const { data } = await self();
    return data;
}
const LoginPage = () => {
    const { isAllowed } = usePermission();
    const { setUser, logout: logoutFromStore } = useAuthStore();
    const { refetch } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false
    });
    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            logoutFromStore();
            return;
        }
    })
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: loginUser,
        onSuccess: async () => {
            const { data: selfData } = await refetch();
            if (!isAllowed(selfData)) {
                logoutMutate();
                return;
            }
            setUser(selfData);
        }
    });
    return (
        <>
            <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                <Space direction="vertical" align="center" size={'large'}>
                    <Layout.Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Logo />
                    </Layout.Content>
                    <Card title={<Space style={{ width: '100%', fontSize: 16, justifyContent: 'center' }}>
                        <LockFilled />  Sign in
                    </Space>} bordered={false} style={{ width: 300 }}>
                        <Form initialValues={{
                            remember: true
                        }} onFinish={(values) => {
                            // console.log(values);
                            mutate({ email: values.username, password: values.password });
                        }}>
                            {
                                isError && (
                                    <Alert type="error" message={error.message} style={{ marginBottom: 24 }} />
                                )
                            }
                            <Form.Item name={'username'} rules={[
                                {
                                    required: true,
                                    message: 'Please enter your Username'
                                },
                                {
                                    type: 'email',
                                    message: "Email is not valid"
                                }
                            ]}>
                                <Input prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item name={'password'} rules={[
                                {
                                    required: true,
                                    message: 'Please enter your Password'
                                }
                            ]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                            </Form.Item>

                            <Flex justify="space-between">
                                <Form.Item name={'remember'} valuePropName="checked">
                                    <Checkbox>
                                        Remember me
                                    </Checkbox>
                                </Form.Item>
                                <a href="" id="loin-form-forgot">Forgot password</a>
                            </Flex>
                            <Form.Item>
                                <Button loading={isPending} type="primary" htmlType="submit" style={{ width: '100%' }}>
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Space>
            </Layout>
        </>
    )
}

export default LoginPage