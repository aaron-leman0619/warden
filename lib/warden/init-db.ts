import { Model, DataTypes, Optional } from "sequelize";
import Warden from "../warden/index";

enum JobStatus {
  Created = "created",
  Pending = "pending",
  Running = "running",
  Done = "done",
  Cancelled = "cancelled",
}

enum LastRunStatus {
  Success = "success",
  Failure = "failure",
}

interface JobAttributes {
  jobId: number;
  name: string;
  recurrance?: string | null;
  data: any;
  status: JobStatus;
  lockedAt?: Date | null;
  nextRunAt?: Date | null;
  lastRunAt?: Date | null;
  lastRunStatus?: LastRunStatus | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface JobInput extends Optional<JobAttributes, "jobId"> {}
interface JobOutput extends Required<JobAttributes> {}

class Job extends Model<JobAttributes, JobInput> implements JobAttributes {
  jobId!: number;
  name!: string;
  recurrance!: string;
  data!: any;
  status!: JobStatus;
  lockedAt!: Date | null;
  nextRunAt!: Date | null;
  lastRunAt!: Date | null;
  lastRunStatus!: LastRunStatus | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export default function init(this: Warden) {
  Job.init(
    {
      jobId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      recurrance: { type: DataTypes.STRING },
      data: { type: DataTypes.JSON },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(JobStatus),
        defaultValue: JobStatus.Created,
      },
      nextRunAt: { type: DataTypes.DATE },
      lockedAt: { type: DataTypes.DATE },
      lastRunAt: { type: DataTypes.DATE },
      lastRunStatus: {
        type: DataTypes.ENUM,
        values: Object.values(LastRunStatus),
      },
    },
    {
      sequelize: this.database,
      modelName: "job",
    }
  );
  this.database.sync().then(() => this.emitter.emit("db-initiated"));
}

export { LastRunStatus, JobInput, JobOutput, JobAttributes, Job, JobStatus };
