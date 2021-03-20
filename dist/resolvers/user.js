"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
let UserOptions = class UserOptions {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserOptions.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserOptions.prototype, "password", void 0);
UserOptions = __decorate([
    type_graphql_1.InputType()
], UserOptions);
let ErrorResponse = class ErrorResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], ErrorResponse.prototype, "success", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
ErrorResponse = __decorate([
    type_graphql_1.ObjectType()
], ErrorResponse);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    createUser(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.password.length < 4) {
                return {
                    error: [
                        {
                            success: false,
                            message: "password must be greater than 3",
                        },
                    ],
                };
            }
            if (options.username.length < 4) {
                return {
                    error: [
                        {
                            success: false,
                            message: "username must be greater than 3",
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const user = em.create(User_1.User, {
                username: options.username,
                password: hashedPassword,
            });
            yield em.persistAndFlush(user);
            req.session.userId = user.id;
            return { user };
        });
    }
    login(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (!user) {
                return {
                    error: [
                        {
                            success: false,
                            message: "username does't exist",
                        },
                    ],
                };
            }
            const validPassword = yield argon2_1.default.verify(user.password, options.password);
            if (!validPassword) {
                return {
                    error: [
                        {
                            success: false,
                            message: "username does't exist",
                        },
                    ],
                };
            }
            console.log(user.id, "hereeeeeeee");
            req.session.userId = user.id;
            console.log(req.session, req.session.userId);
            return { user };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserOptions, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserOptions, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map