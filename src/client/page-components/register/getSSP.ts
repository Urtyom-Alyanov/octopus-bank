import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps<{
  FullName: string;
  vk_token?: string;
  oauth_data?: string;
  VkTag: string;
}> = async ({ query }) => {
  try {
    const vkApiUrl = new URL('https://api.vk.com/method/users.get');

    vkApiUrl.searchParams.append('access_token', query.vk_token as string);
    vkApiUrl.searchParams.append('v', '5.131');
    vkApiUrl.searchParams.append('fields', 'domain');

    const data: {
      response: [{ first_name: string; last_name: string; domain: string }];
    } = await fetch(vkApiUrl).then((res) => res.json());

    if ('error' in data) throw Error();

    const FullName = `${data.response[0].first_name} ${data.response[0].last_name}`;
    const VkTag = data.response[0].domain;

    console.log(query.oauth_data);

    return {
      props: {
        oauth_data: query.oauth_data as string | undefined,
        vk_token: query.vk_token as string,
        FullName,
        VkTag,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
