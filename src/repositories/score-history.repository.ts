// import { Person, PersonSchema } from '~/schemas/person.schema';
import { ScoreHistory, ScoreHistorySchema } from '~/schemas/score-history.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(ScoreHistory, ScoreHistorySchema)
export class ScoreHistoryRepository extends BaseRepository<ScoreHistory> {}
