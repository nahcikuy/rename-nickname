import { createClient } from 'oicq';
import config from './config.json';

const client = createClient(config.number, {
  platform: 3,
  log_level: 'info',
});

function login() {
  client.on('system.login.qrcode', () => {
    console.log('扫描二维码后，按回车键继续...');
    process.stdin.once('data', () => {
      client.login();
    });
  });

  client.login();
}

async function getMatchedGroupList() {
  console.log(`正在搜索满足条件的群，匹配条件：{match: ${config.match}}`);
  const result: { group_id: number; group_name: string; card: string }[] = [];
  for (const [group_id, group] of client.getGroupList()) {
    try {
      const me = await client.getGroupMemberInfo(group_id, config.number);
      if (me.card.match(new RegExp(config.match))) {
        console.log(group_id, group.group_name, me.card);
        result.push({
          group_id,
          group_name: group.group_name,
          card: me.card,
        });
      }
    } catch (e) {}
  }
  return result;
}

function main() {
  login();
  client.on('system.online', async () => {
    const result = await getMatchedGroupList();

    console.log('WARNING: ');
    console.log('即将替换上述所有群的群名片。');
    console.log(
      `替换规则为 {match: ${config.match}, replace: ${config.replace}, flags: g}。`
    );
    console.log('此操作不可撤销。');
    console.log('按回车键继续...');

    process.stdin.once('data', async () => {
      let count = 0;
      for (const item of result) {
        const newCard = item.card.replace(
          new RegExp(config.match, 'g'),
          config.replace
        );
        const status = await client.setGroupCard(
          item.group_id,
          config.number,
          newCard
        );
        console.log(
          `修改群名片${status ? '成功' : '失败'}`,
          item.group_id,
          item.group_name,
          `${item.card} => ${newCard}`
        );
        count += status ? 1 : 0;
      }
      console.log(`操作已完成，成功修改了${count}个群的群名片。`);
      process.exit(0);
    });
  });
}

main();
