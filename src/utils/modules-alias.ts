import * as path from 'path';
import moduleAlias from 'module-alias';

//arquivo criado para definidir os alias, para que

const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
});
